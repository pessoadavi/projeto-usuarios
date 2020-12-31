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

    /**
     * @param {any} id
     */
    set setId(id){
        this.id = id;
    }

    get getName(){
        return this.name;
    }

    /**
     * @param {any} name
     */
    set setName(name){
        this.name = name;
    }

    get getGender(){
        return this.gender;
    }

    /**
     * @param {any} gender
     */
    set setGender(gender){
        this.gender = gender;
    }

    get getBirth(){
        return this.birth;
    }

    /**
     * @param {any} birth
     */
    set setBirth(birth){
        this.birth = birth;
    }

    get getCountry(){
        return this.country;
    }

    /**
     * @param {any} country
     */
    set setCountry(country){
        this.country = country;
    }
    
    get getEmail(){
        return this.email;
    }

    /**
     * @param {any} email
     */
    set setEmail(email){
        this.email = email;
    }

    get getPassword(){
        return this.password;
    }

    /**
     * @param {any} password
     */
    set setPassword(password){
        this.password = password;
    }

    get getPhoto(){
        return this.photo;
    }

    /**
     * @param {any} value
     */
    set setPhoto(value){
        this.photo = value;
    }

    get getAdmin(){
        return this.admin;
    }

    /**
     * @param {any} admin
     */
    set setAdmin(admin){
        this.admin = admin;
    }

    get getRegister(){
        return this.register;
    }

    deleteFromStorage(){

        let users = User.getUsersStorage();

        users.forEach( (userData, index) => {

            if(this.id == userData.id){

                users.splice(index, 1)              // Splice retira do array o a partir índice especificado por index e retira a quantidade de itens definidos (1)
            }
        });

        localStorage.setItem("users", JSON.stringify(users));

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

    static getUsersStorage(){                                          // Método que captura os valores do usuário no storage.

        let users = [];

        if(localStorage.getItem("users")){                             // Verifica se tem users já cadastados.

            users = JSON.parse(localStorage.getItem("users"));         // Existindo ele  insere na variável users os já existentes para que seja adicionado um novo a seguir com o push().
        }

        return users;
    }

    getNewId(){


        let id, users = User.getUsersStorage();                       // Adiciona os registros do Sotorage.

        users.filter((value) => {                                     // value recebe as interações de cada item da array
            value.id ? id = value.id + 1 : id = 0;                    // Verifica se existe id. se sim o novo é o atual +1, se não é zero.
        })
        return id
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

                this.id = this.getNewId();                                     // Método para gerar um id

                users.push(this);                                              // Insere o novo usuários no array de users.

        }
     
        //sessionStorage.setItem("users", JSON.stringify(users));      // Converte novamente para string e guarda novamente em users.
        localStorage.setItem("users", JSON.stringify(users));

    }

}