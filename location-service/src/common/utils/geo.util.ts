export interface Point {
  latitude: number;
  longitude: number;
}

export class GeoUtil {
  private static readonly EARTH_RADIUS_KM = 6371;

  /**
   * Calculate distance between two points using Haversine formula
   * @param point1 First point
   * @param point2 Second point
   * @returns Distance in kilometers
   */
  static calculateDistance(point1: Point, point2: Point): number {
    const lat1Rad = this.toRadians(point1.latitude);
    const lat2Rad = this.toRadians(point2.latitude);
    const deltaLat = this.toRadians(point2.latitude - point1.latitude);
    const deltaLon = this.toRadians(point2.longitude - point1.longitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return this.EARTH_RADIUS_KM * c;
  }

  /**
   * Check if a point is within a given radius of a center point
   */
  static isWithinRadius(center: Point, point: Point, radiusKm: number): boolean {
    return this.calculateDistance(center, point) <= radiusKm;
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   */
  static toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Create PostGIS Point from lat/lng
   */
  static createPoint(latitude: number, longitude: number, precision = 4): string {
    const format = (value: number) => value.toFixed(precision);
    return `SRID=4326;POINT(${format(longitude)} ${format(latitude)})`;
  }

  /**
   * Parse PostGIS Point to lat/lng
   */
  static parsePoint(wkt: any): Point | null {
    if (!wkt) return null;
    
    // Handle PostGIS geometry object
    if (typeof wkt === 'object' && wkt.coordinates) {
      return {
        longitude: wkt.coordinates[0],
        latitude: wkt.coordinates[1],
      };
    }
    
    // Handle WKT string: POINT(lng lat)
    if (typeof wkt === 'string') {
      const match = wkt.match(/POINT\s*\(([^)]+)\)/i);
      if (match) {
        const [lng, lat] = match[1].split(' ').map(Number);
        return { latitude: lat, longitude: lng };
      }
    }
    
    return null;
  }

  /**
   * Validate coordinates
   */
  static isValidCoordinate(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  /**
   * Calculate bounding box for a given center and radius
   */
  static getBoundingBox(center: Point, radiusKm: number): {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } {
    const latDelta = (radiusKm / this.EARTH_RADIUS_KM) * (180 / Math.PI);
    const lngDelta = latDelta / Math.cos((center.latitude * Math.PI) / 180);

    return {
      minLat: center.latitude - latDelta,
      maxLat: center.latitude + latDelta,
      minLng: center.longitude - lngDelta,
      maxLng: center.longitude + lngDelta,
    };
  }
}
