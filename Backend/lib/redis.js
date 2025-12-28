import Redis from "ioredis"

const redis = new Redis("rediss://default:AUVQAAIncDIxYzY1YzdjMTJmMWI0YjE2YmNjN2Q3Y2M1NjQwZDI1ZXAyMTc3NDQ@adapted-man-17744.upstash.io:6379");
await redis.set('foo', 'bar');
export{
  redis
}