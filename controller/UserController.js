class UserController {

    constructor(formIdCreate, formIdUpdate, tableId){                   // Contrutor recebe os dois id's do objeto userController, respectivamente . 

        this.formElementCreate = document.getElementById(formIdCreate);       // Variável formElementCreate recebe o elemento do id form-user-create.
        this.formElementUpdate = document.getElementById(formIdUpdate);       // Variável formElementCreate recebe o elemento do id form-user-update.
        this.tableElement = document.getElementById(tableId);                 // Variável tableElement recebe o elemento do id table-users.
        
        this.onSubmit();                                                // Inicializa o método.
        this.onEdit();                                                  // Inicializa o método.
    }

    onSubmit(){                                                               // Método do evento de clique do botão "salvar"

        this.formElementCreate.addEventListener('submit',(event)=>{           // Escuta o evento na DOM do id form-user-create quando o evento submit é acionado.

            event.preventDefault();                                           // Evita que toda a página seja atualizada sendo apenas o elemento atualizado.

            let btn = this.formElementCreate.querySelector("[type=submit]");  // Retorna o primeiro elemento do tipo [type=submit]

            btn.disabled = true;                                              // Desabilita o botão de salvar

            let values = this.getFormValues(this.formElementCreate);

            if(!values) return false;                                         // Verifica se values é falso, ou seja, boolean. Caso seja interrompe leitura da foto                

            this.getPhoto().then(
                
                (content)=>{                                                  // Função com o retorno do método caso a promisse seja atendida (resolve)
                    values.setPhoto = content;                                // Guarda a imagem no atributo photo do objecto values   

                    this.addLine(values);                                     // Método que renderiza os dados do formulário a partir dos dados armazenados pelo getFormValues()

                    this.formElementCreate.reset();                           // Limpa o formulário   

                    btn.disabled = false;                                     // Habilita o botão de salvar
                },
                
                
                (erro)=>{                                                     // Função com o retorno do método caso a promisse não seja atendida (reject)  
                    console.error(erro);

                });
             
        });
    }

    onEdit(){

        document.querySelector("#box-user-update .btn-delete").addEventListener('click', event =>{

            this.showPanelCreate();
        });

        this.formElementUpdate.addEventListener('submit', event =>{

            event.preventDefault();

            let btn = this.formElementUpdate.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getFormValues(this.formElementUpdate);

            console.log(values);

            let index = this.formElementUpdate.dataset.trIndex;
           
            let tr = this.tableElement.rows[index];

            tr.dataset.user = JSON.stringify(values);       // Reescreve o data-user já existente

            tr.innerHTML = `
                                                                        
            <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${values.name}</td>
            <td>${values.email}</td>
            <td>${values.admin}</td>
            <td>${Utils.dateFormat(values.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
       
        `;

        this.addEventsTr(tr);

        this.countUsers();

        });

    }

    getFormValues(formElement){                                          // Método que capta as informações dos campos do fomulário.

        let user = {};                                                  // Cria um arquivo JSON chamado user. 
        let isValid = true;

        [...formElement.elements].forEach((field, index)=>{             // Varre o array relacionado ao elemento (elements) de id=form-user-create  
                                                                        // e armazena seus valores seus nomes e respetivos valores.
                                                                        // O operador spread [...] "converte" o objeto formElementCreate.elements em um array para ser tratado pelo forEach e não dar problema

                if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){  // Verifica se esses campos estã preenchidos.


                field.parentElement.classList.add('has-error');         // Adiciona uma classe pelo classList.add no elemento pai parentElement.
                isValid = false;                                        // Seta a invalidade por não estarem preenchidos.

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


    getPhoto(){

        return new Promise((resolve, reject) =>{                            // Retorna o objeto Promisse 
            
            let fileReader = new FileReader();                              // Objeto do tipo FileReader

            let elements = [...this.formElementCreate.elements].filter(item =>{   // Método filter retorna um valor do array especificada pela função de callback (item)
    
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


    

    addLine(dataUser){                                                  // Método que recebe o objeto objectUser do tipo User e renderiza valores na tabela      

    let tr = document.createElement("tr");                              // Cria a tag tr
     
    tr.dataset.user = JSON.stringify(dataUser);                         // Neste caso cria no elemento tr um atributo 'data-user' contento uma string (escrito por JSON.stringify)
                                                                        // a partir do parâmetro que o método recebeu (objeto datauser).    

                                                                        // innerHTML envia para a DOM na tag do id associado a tableElement o HTML abaixo.    
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

        this.addEventsTr(tr);
    
        this.tableElement.appendChild(tr);                             // AppendChild adiciona html como elemento filho do atual
    
        this.countUsers();

    }

    addEventsTr(tr){

        
        tr.querySelector(".btn-edit").addEventListener('click', event => {

            let json = JSON.parse(tr.dataset.user);                     // Armazena em json a string guardada no atributo data-user na tag tr
            let form = document.querySelector("#box-user-update");      // Seleciona o id do formulário.
            
            form.dataset.trIndex = tr.sectionRowIndex;                  // Toma o índice da linha. primeira linha é indice zero.

            for (let index in json){                                    // Laço for in varre objeto json obtendo seus parâmetros.

                let field = form.querySelector(`[name = ${index}]`);    // Guarda no objeto field as tags que possuem atributos name (name=name, name=gender, name=birth...)
                                                                        // sendo o valor do atributo oriundo do índice do for in (index)
                
                if(field){
                   
                    switch(field.type){

                        case 'file':                                    // Verifica o type do tag photo e manda prosseguir. o continue faz ignorar o resto das instruções e pula próximo laço. 
                            continue;
                            break;

                        case 'radio':
                            field = form.querySelector(`[name=${index}][value=${json[index]}]`);    // Seletor captura as tagsq ue contém name=radio e value=M ou value=F.
                            field.checked = true;                                                   // Marca o seletor selecionado
                            break;

                        case 'checkbox':
                            field.checked = json[index];
                            break;

                        default:
                            field.value = json[index];
                    }
 
                }
                
            }
            
            this.showPanelUpdate();
            

        });


    }

    

    countUsers(){ 

        let numberUsers = 0;
        let numberAdmins = 0;

        [...this.tableElement.children].forEach((tr) => {               // Conta pelo forEach quantas tags tr temos em tableElement.

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);                     // Guarda em user os atributos de data-user no elemento tr e converte a string em arquivo JSON.

            if(user.admin == "Sim") numberAdmins++                      // Adiciona valor caso seja administrador.
    

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