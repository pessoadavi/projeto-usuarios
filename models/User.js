class User {

    constructor(name, gender, birth, country, email, password, photo, admin){

        this.name = name;
        this.gender = gender;
        this.birth = birth;
        this.country = country;
        this.email = email;
        this.password = password;
        this.photo = photo;
        this.admin = admin;
        this.register=  new Date();
        

    }

    get getName(){
        return this.name;
    }

    set setName(name){
        this.name = name;
    }

    get getGender(){
        return this.gender;
    }

    set setGender(gender){
        this.gender = gender;
    }

    get getBirth(){
        return this.birth;
    }

    set setBirth(birth){
        this.birth = birth;
    }

    get getCountry(){
        return this.country;
    }

    set setCountry(country){
        this.country = country;
    }
    
    get getEmail(){
        return this.email;
    }

    set setEmail(email){
        this.email = email;
    }

    get getPassword(){
        return this.password;
    }

    set setPassword(password){
        this.password = password;
    }

    get getPhoto(){
        return this.photo;
    }

    set setPhoto(photo){
        this.photo = photo;
    }

    get getAdmin(){
        return this.admin;
    }

    set setAdmin(admin){
        this.admin = admin;
    }

    get getRegister(){
        return this.register;
    }

}