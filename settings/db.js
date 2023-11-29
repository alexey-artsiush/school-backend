import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('test-db', 'root', '1234567890', {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
})

export default sequelize
