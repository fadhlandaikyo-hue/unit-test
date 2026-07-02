module.exports = {
    apps: [
        {
            name: "daikyou-api",
            script: "src/main.js",
            cwd: "/var/www/belajar-nodejs-restful-api",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            max_memory_restart: "500M",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
                DATABASE_URL: "process.env.DATABASE_URL"
            }
        }
    ]
};
