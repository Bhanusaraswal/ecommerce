import { Redis } from '@upstash/redis';

// Initialize Redis client with error handling
let redis = null;
try {
	const redisUrl = process.env.UPSTASH_REDIS_URL || 'https://knowing-snipe-15385.upstash.io';
	const redisToken = process.env.UPSTASH_REDIS_TOKEN || 'ATwZAAIncDE2YTJkMTMyODUzYzk0NGNhODgzYjRiNmQxYjRhYjhiOHAxMTUzODU';
	
	redis = new Redis({
		url: redisUrl,
		token: redisToken,
		retry: {
			retries: 0,
		}
	});
	
	console.log("✅ Upstash Redis client initialized");
} catch (error) {
	console.log("⚠️  Redis initialization error:", error.message);
	console.log("   Application will continue without Redis caching.");
}

// Export redis (can be null if initialization failed)
export { redis };
export default redis;