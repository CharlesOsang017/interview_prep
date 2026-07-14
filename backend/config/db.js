import mongoose from 'mongoose';
import dns from 'dns';

// Fix local Node.js v18+ DNS resolution issues without breaking cloud providers
if (!process.env.VERCEL) {
    try {
        dns.setDefaultResultOrder('ipv4first');
        if (process.env.IP_ADDRESS_ONE && process.env.IP_ADDRESS_TWO) {
            dns.setServers([process.env.IP_ADDRESS_ONE, process.env.IP_ADDRESS_TWO]);
        }
    } catch (error) {
        console.warn('Could not set custom DNS servers:', error.message);
    }
}

// Track connection state globally across serverless invocations
let cachedConnection = null;

const connectDB = async () => {
    // Check if we already have a live, open connection (readyState 1 means connected)
    if (mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return;
    }

    // If a connection process is already running, await it instead of starting a new one
    if (cachedConnection) {
        console.log('Awaiting existing connection promise...');
        await cachedConnection;
        return;
    }

    try {
        console.log('Establishing new database connection...');
        // Save the connection promise globally to prevent race conditions
        cachedConnection = mongoose.connect(process.env.MONGO_URI);
        
        await cachedConnection;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to Database:', error);
        cachedConnection = null; // Clear the cache on failure so it retries next time

        if (!process.env.VERCEL) {
            process.exit(1);
        } else {
            throw error; // Let Vercel handle the function crash gracefully
        }
    }
};

export default connectDB;