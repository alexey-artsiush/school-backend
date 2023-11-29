import { DataTypes } from 'sequelize'
import sequelize from '../settings/db.js'

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
})

const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    refreshToken: { type: DataTypes.STRING(5000), required: true },
})

User.hasMany(Token)
Token.belongsTo(User)

export { User, Token }
