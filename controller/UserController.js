class UserController {

    constructor(formId, tableId){                                       // Contrutor recebe os dois id's do objeto userController, respectivamente . 

        this.formElement = document.getElementById(formId);             // Variável formElement recebe o elemento do id form-user-create
        this.tableElement = document.getElementById(tableId);           // Variável tableElement recebe o elemento do id table-users.
        
        this.onSubmit();
        this.onEdit();
    }

    onSubmit(){                                                         // Método do evento de clique do botão "salvar"

        this.formElement.addEventListener('submit',(event)=>{           // Escuta o evento na DOM do id form-user-create quando o evento submit é acionado.

            event.preventDefault();                                     // Evita que toda a página seja atualizada sendo apenas o elemento atualizado.

            let btn = this.formElement.querySelector("[type=submit]");

            btn.disabled = true;                                        // Desabilita o botão de salvar

            let values = this.getFormValues();

            if(!values) return false;                                   // Verifica se values é falso, ou seja, boolean. Caso seja interrompe leitura da foto                

            this.getPhoto().then(
                
                (content)=>{                                             // Função com o retorno do método caso a promisse seja atendida (resolve)
                    values.setPhoto = content;                           // Guarda a imagem no atributo photo do objecto values   

                    this.addLine(values);                                // Método que renderiza os dados do formulário a partir dos dados armazenados pelo getFormValues()

                    this.formElement.reset();                            // Limpa o formulário   

                    btn.disabled = false;                                // Habilita o botão de salvar
                },
                
                
                (erro)=>{                                                // Função com o retorno do método caso a promisse não seja atendida (reject)  
                    console.error(erro);

                });
             
        });
    }


    getPhoto(){

        return new Promise((resolve, reject) =>{                            // Retorna o objeto Promisse 
            
            let fileReader = new FileReader();                              // Objeto do tipo FileReader

            let elements = [...this.formElement.elements].filter(item =>{   // Método filter retorna um valor do array especificada pela função de callback (item)
    
                if(item.name === "photo") {                                 // Nome do item é photo? Se sim ele retorna o valor e guarda em elements
                    return item;
                }
    
            });
    
            let file = elements[0].files[0];                                // atributo files[0] contém as informações do arquivo que foi lido como verificado no consolo.log
                                                                            // o index é [0], pois pode ser mais de um arquivo. Então pego o primeiro.
    

            if(file){
                
                fileReader.readAsDataURL(file);                             // Método que lê o conteúdo do arquivo
            
            } else {
                
                resolve('dist/img/boxed-bg.jpg');

            } 
              
    
            fileReader.onload = () => {                                     // Manipulador de evento que é executado quando a leitura do arquivo é feita com sucesso
    
                resolve(fileReader.result);                                 // Caso a promisse seja atendida ele retorna o result do fileReader pelo resolve
                
            };

            fileReader.onerror = (erro) => {                                // Manipulador de evento que é executado quando a leitura do arquivo é mal sucedida

                reject(erro);                                               // Caso a promisse não seja atendida ele retorna o erro do fileReader pelo reject
            }
        });
    }


    getFormValues(){                                                    // Método que capta as informações dos campos do fomulário.

        let user = {};                                                  // Cria um arquivo JSON chamado user. 
        let isValid = true;

        [...this.formElement.elements].forEach((field, index)=>{        // Varre o array relacionado ao elemento (elements) de id=form-user-create  
                                                                        // e o armazena seus valores seus nomes e respetivos valores .
                                                                        // O operador spread [...] "converte" o objeto formElement.elements em um array para ser tratado pelo forEach e não dar problema
 
           if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){


                field.parentElement.classList.add('has-error');         // Adiciona uma classe pelo classList.add no elemento pai parentElement
                isValid = false;

            }


            if(field.name == "gender") {                            
        
                if(field.checked) {
                    
                    user[field.name] = field.value;                     // Insere no JSON o nome do atributo da tag junto com o valor do campo
                }                                                       // Como percorre o array o atributo name do elemento field estes são colocados em []
                                                                        // para a inserção de dados ser dinâmica
            
            } else if (field.name == 'admin') {

                user[field.name] = (field.checked) ? "Sim" : "Não";
 
            } else {
            
                user[field.name] = field.value;                         // Insere no JSON o nome do atributo da tag junto com o valor do campo
            }                                                           // Como percorre o array o atributo name do elemento field estes são colocados em []
        });                                                             // para a inserção de dados ser dinâmica
    
        if(!isValid){                                                   // Verifica se não está válido
            return false;                                               // Se sim ele para a execução e não registra na página
        }
        
        var objectUser = new User(user.name,                            // O objeto objectUser do tipo User recebe do JSON user as informações
                                  user.gender,                          // que foram escritas nos campos e guardados pelo forEach.  
                                  user.birth,
                                  user.country, 
                                  user.email, 
                                  user.password, 
                                  user.photo,
                                  user.admin);

        return objectUser;                                              // Retorna para o método addLine um objeto objectUser do tipo User.
    }

    addLine(dataUser){                                                  // Método que recebe o objeto objectUser do tipo User e renderiza valores na tabela      

    let tr = document.createElement("tr");
                                                                        //  innerHTML envia para a DOM na tag do id associado a tableElement o HTML abaixo. 
        
    tr.dataset.user = JSON.stringify(dataUser);                         //                 //                                                                             

        tr.innerHTML = `
                                                                        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
       
        `;

        tr.querySelector(".btn-edit").addEventListener('click', action => {

            console.log(JSON.parse(tr.dataset.user));
            this.showPanelUpdate();
            

        });
    
        this.tableElement.appendChild(tr);                             // AppendChild adiciona html como elemento filhodo atual
    
        this.countUsers();

    }

    onEdit(){

        document.querySelector("#box-user-update .btn-delete").addEventListener('click', action =>{

            this.showPanelCreate();
        });

    }

    countUsers(){

        let numberUsers = 0;
        let numberAdmins = 0;

        [...this.tableElement.children].forEach((tr) => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);                     // JSON.parse faz string se tornar um arquivo JSON

            if(user.admin == "Sim") numberAdmins++
    

        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmins;

    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }
}