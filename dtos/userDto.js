export default class UserDto {
    id
    email
    password

    constructor(model) {
        this.id = model.id
        this.email = model.email
        this.password = model.password
    }
}
