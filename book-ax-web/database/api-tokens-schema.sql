-- =====================================================
-- BOOK.AX API TOKEN SYSTEM
-- =====================================================
-- API Tokens für technische User (MCP Server, etc.)
-- Tokens sind unabhängig von User-Sessions
-- =====================================================

-- =====================================================
-- API TOKENS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Token & Identification
  token VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL, -- z.B. "MCP Server", "Content Automation"
  description TEXT,
  
  -- Owner
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Permissions (JSON array of scopes)
  -- Examples: ["cms:read", "cms:write", "cms:delete", "hotels:read", "bookings:read"]
  scopes JSONB NOT NULL DEFAULT '[]',
  
  -- Status & Expiration
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL = never expires
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- Rate Limiting
  rate_limit INTEGER DEFAULT 1000, -- Requests per hour
  requests_count INTEGER DEFAULT 0,
  requests_reset_at TIMESTAMP WITH TIME ZONE,
  
  -- IP Restrictions (optional)
  allowed_ips JSONB DEFAULT '[]', -- Empty array = all IPs allowed
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_api_tokens_token ON api_tokens(token);
CREATE INDEX idx_api_tokens_user ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_active ON api_tokens(is_active) WHERE is_active = true;
CREATE INDEX idx_api_tokens_expires ON api_tokens(expires_at) WHERE expires_at IS NOT NULL;

-- =====================================================
-- API TOKEN USAGE LOGS (optional, für Analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS api_token_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID NOT NULL REFERENCES api_tokens(id) ON DELETE CASCADE,
  
  -- Request Details
  endpoint VARCHAR(512) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER,
  
  -- Client Info
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Timing
  response_time_ms INTEGER,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_token_logs_token ON api_token_logs(token_id);
CREATE INDEX idx_api_token_logs_created ON api_token_logs(created_at);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function: Generate secure random token
CREATE OR REPLACE FUNCTION generate_api_token()
RETURNS VARCHAR AS $$
DECLARE
  token VARCHAR;
BEGIN
  -- Generate token format: bax_live_<32 random chars>
  token := 'bax_live_' || encode(gen_random_bytes(24), 'hex');
  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- Function: Validate token and check scopes
CREATE OR REPLACE FUNCTION validate_api_token(
  token_value VARCHAR,
  required_scopes TEXT[]
)
RETURNS TABLE (
  is_valid BOOLEAN,
  token_id UUID,
  user_id UUID,
  scopes JSONB,
  error_message TEXT
) AS $$
DECLARE
  token_record RECORD;
  token_scopes TEXT[];
  has_all_scopes BOOLEAN := true;
  scope TEXT;
BEGIN
  -- Find token
  SELECT * INTO token_record
  FROM api_tokens
  WHERE token = token_value;

  -- Token not found
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID, NULL::JSONB, 'Invalid token'::TEXT;
    RETURN;
  END IF;

  -- Token inactive
  IF token_record.is_active = false THEN
    RETURN QUERY SELECT false, token_record.id, token_record.user_id, token_record.scopes, 'Token is inactive'::TEXT;
    RETURN;
  END IF;

  -- Token expired
  IF token_record.expires_at IS NOT NULL AND token_record.expires_at < NOW() THEN
    RETURN QUERY SELECT false, token_record.id, token_record.user_id, token_record.scopes, 'Token has expired'::TEXT;
    RETURN;
  END IF;

  -- Check scopes
  SELECT array(SELECT jsonb_array_elements_text(token_record.scopes)) INTO token_scopes;
  
  FOREACH scope IN ARRAY required_scopes
  LOOP
    IF NOT (scope = ANY(token_scopes) OR 'admin' = ANY(token_scopes)) THEN
      has_all_scopes := false;
      EXIT;
    END IF;
  END LOOP;

  IF NOT has_all_scopes THEN
    RETURN QUERY SELECT false, token_record.id, token_record.user_id, token_record.scopes, 'Insufficient permissions'::TEXT;
    RETURN;
  END IF;

  -- Update last_used_at
  UPDATE api_tokens
  SET last_used_at = NOW(),
      updated_at = NOW()
  WHERE id = token_record.id;

  -- Valid
  RETURN QUERY SELECT true, token_record.id, token_record.user_id, token_record.scopes, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (optional, für Testing)
-- =====================================================

-- Create sample admin API token (disabled by default)
-- INSERT INTO api_tokens (token, name, description, user_id, scopes, is_active)
-- VALUES (
--   'bax_live_development_test_token_12345',
--   'Development Test Token',
--   'For local development testing',
--   (SELECT id FROM users WHERE email = 'admin@book.ax' LIMIT 1),
--   '["admin", "cms:read", "cms:write", "cms:delete"]',
--   false
-- );

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_token_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view all tokens
CREATE POLICY api_tokens_admin_read
  ON api_tokens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = api_tokens.user_id
      AND users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Users can view their own tokens
CREATE POLICY api_tokens_user_read
  ON api_tokens FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Only admins can create tokens
CREATE POLICY api_tokens_admin_create
  ON api_tokens FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: Users can update their own tokens
CREATE POLICY api_tokens_user_update
  ON api_tokens FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Only admins can delete tokens
CREATE POLICY api_tokens_admin_delete
  ON api_tokens FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Logs: Only admins can view logs
CREATE POLICY api_token_logs_admin_read
  ON api_token_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE api_tokens IS 'API Tokens für technische Integrationen (MCP, Automation, etc.)';
COMMENT ON COLUMN api_tokens.token IS 'Unique API token (format: bax_live_<random>)';
COMMENT ON COLUMN api_tokens.scopes IS 'JSON array of permission scopes (e.g., ["cms:read", "cms:write"])';
COMMENT ON COLUMN api_tokens.rate_limit IS 'Maximum requests per hour (0 = unlimited)';
COMMENT ON COLUMN api_tokens.allowed_ips IS 'JSON array of allowed IP addresses (empty = all IPs)';

COMMENT ON TABLE api_token_logs IS 'Usage logs für API Tokens (Analytics & Monitoring)';

COMMENT ON FUNCTION generate_api_token() IS 'Generates a secure random API token';
COMMENT ON FUNCTION validate_api_token(VARCHAR, TEXT[]) IS 'Validates token and checks if it has required scopes';
