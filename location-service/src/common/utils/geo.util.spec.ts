import { GeoUtil } from './geo.util';

describe('GeoUtil', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between Berlin and Munich', () => {
      const berlin = { latitude: 52.5200, longitude: 13.4050 };
      const munich = { latitude: 48.1351, longitude: 11.5820 };
      
      const distance = GeoUtil.calculateDistance(berlin, munich);
      
      expect(distance).toBeGreaterThan(500);
      expect(distance).toBeLessThan(600);
    });

    it('should return 0 for same location', () => {
      const point = { latitude: 52.5200, longitude: 13.4050 };
      const distance = GeoUtil.calculateDistance(point, point);
      
      expect(distance).toBe(0);
    });

    it('should calculate distance between New York and Los Angeles', () => {
      const newYork = { latitude: 40.7128, longitude: -74.0060 };
      const losAngeles = { latitude: 34.0522, longitude: -118.2437 };
      
      const distance = GeoUtil.calculateDistance(newYork, losAngeles);
      
      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });
  });

  describe('isWithinRadius', () => {
    it('should return true if point is within radius', () => {
      const center = { latitude: 52.5200, longitude: 13.4050 };
      const nearby = { latitude: 52.5300, longitude: 13.4100 };
      
      expect(GeoUtil.isWithinRadius(center, nearby, 5)).toBe(true);
    });

    it('should return false if point is outside radius', () => {
      const berlin = { latitude: 52.5200, longitude: 13.4050 };
      const munich = { latitude: 48.1351, longitude: 11.5820 };
      
      expect(GeoUtil.isWithinRadius(berlin, munich, 100)).toBe(false);
    });
  });

  describe('isValidCoordinate', () => {
    it('should validate correct coordinates', () => {
      expect(GeoUtil.isValidCoordinate(52.5200, 13.4050)).toBe(true);
      expect(GeoUtil.isValidCoordinate(0, 0)).toBe(true);
      expect(GeoUtil.isValidCoordinate(-90, -180)).toBe(true);
      expect(GeoUtil.isValidCoordinate(90, 180)).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      expect(GeoUtil.isValidCoordinate(91, 0)).toBe(false);
      expect(GeoUtil.isValidCoordinate(-91, 0)).toBe(false);
      expect(GeoUtil.isValidCoordinate(0, 181)).toBe(false);
      expect(GeoUtil.isValidCoordinate(0, -181)).toBe(false);
    });
  });

  describe('createPoint', () => {
    it('should create PostGIS point string', () => {
      const point = GeoUtil.createPoint(52.5200, 13.4050);
      expect(point).toBe('SRID=4326;POINT(13.4050 52.5200)');
    });

    it('should respect custom precision values', () => {
      const highPrecision = GeoUtil.createPoint(52.5200123, 13.4050456, 6);
      const lowPrecision = GeoUtil.createPoint(52.5200123, 13.4050456, 2);

      expect(highPrecision).toBe('SRID=4326;POINT(13.405046 52.520012)');
      expect(lowPrecision).toBe('SRID=4326;POINT(13.41 52.52)');
    });
  });

  describe('getBoundingBox', () => {
    it('should calculate bounding box for given radius', () => {
      const center = { latitude: 52.5200, longitude: 13.4050 };
      const box = GeoUtil.getBoundingBox(center, 50);
      
      expect(box.minLat).toBeLessThan(center.latitude);
      expect(box.maxLat).toBeGreaterThan(center.latitude);
      expect(box.minLng).toBeLessThan(center.longitude);
      expect(box.maxLng).toBeGreaterThan(center.longitude);
    });
  });
});
