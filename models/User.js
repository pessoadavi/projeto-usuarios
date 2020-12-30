class User {

    constructor(name, gender, birth, country, email, password, photo, admin){

        this.id;
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

    get getId(){
        return this.id;
    }

    set setId(id){
        this.id = id;
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

    loadFromJson(json){

        for(let name in json){

            switch(name){

                case 'register':
                    this[name] = new Date(json[name]);            
                    break;
            
                default:
                    this[name] = json[name];

            }

        }


    }

    static getUsersStorage(){

        let users = [];

        if(localStorage.getItem("users")){                             // Verifica se tem users já cadastados.

            users = JSON.parse(localStorage.getItem("users"));         // Existindo ele  insere na variável users os já existentes para que seja adicionado um novo a seguir com o push().
        }

        return users;
    }

    getNewId(){


        if(!window.id) window.id = 0;            // Na aplicação global não existe id? // Crio o id caso não exista.
                                        
            id++;                                // Se existir soma-se para criar uma nova.

            return id;
    }

    save(){

        let users = User.getUsersStorage();      // retorna todos os usuários do localStorage.

        if(this.id > 0){                         // Existe id?

             users.map( u =>{

                if(u.id == this.id){             // id varrido é o mesmo que quero editar?

                    Object.assign(u, this);      // Substitui dados do objeto atual no mapeado de acordo com o id.
                }

                return u;

             });

        } else {

                this.id = this.getNewId();

                users.push(this);                                              // Insere o novo usuários no array de users.

        }
     
        //sessionStorage.setItem("users", JSON.stringify(users));      // Converte novamente para string e guarda novamente em users.
        localStorage.setItem("users", JSON.stringify(users));

    }

}