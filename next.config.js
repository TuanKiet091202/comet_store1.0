// next.config.js
module.exports = {
   async rewrites() {
      return [
         {
            source: '/api/:path*',
            destination: 'https://comet-admin-tau.vercel.app/api/:path*',
         },
      ];
   },
};
