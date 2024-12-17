export const config = {
  port: process.env.PORT || 3001,
  clientOrigin: '*', // Allow all origins in production
  nodeEnv: process.env.NODE_ENV || 'development'
};