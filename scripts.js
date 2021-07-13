// Colocando por último o JavaScript. Padrão depois do footer. E vai dar dinamismo ou seja funcionalidade.

const modal = { /* const: porque não vai mudar, ao logo da minha aplicação. Mas também vai receber um Objeto que tem acesso a propriedades e funcionalidades. Que depois vai receber duas funcionalidade que vai usar o document que é a DOM e também objeto principal da arvore DOM. O DOM sendo um modelo de toda a estrutura HTML passada para o Javascript, e quem cria este modelo é o Browser, então browser cria um objeto, este objeto é o document, que vai ser colocado a passagem do html para o Javascript tento o Objeto Document é possivél acesso novamente a propriedades e funcinalidades. Sendo assim colocado uma funcionalidade querySelector que vai procurar por seletores no css, procurando, vai usar uma propriedade chamada classList para adicionar uma class (ativa ou active). */ 
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active') // Podeira usar como ideia função toggle() também.
    },
    close() {
        // Fechar o modal
        // Remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const Storage = {
    get() { // Pegar informações
        return JSON.parse(localStorage.getItem('wise.coin:transactions')) || []
    },

    set(transactions) { // Guardar informações
        localStorage.setItem('wise.coin:transactions', JSON.stringify(transactions))
    }

}

const Transaction = { // const transaction objeto (Pegar o HTML e passar para o Javascript) está sendo guardada em memoria para ser utlizada em algum momento. 
    all: Storage.get(),
   
    add(transaction) {
        
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        
        App.reload()
    },

    incomes() {
        // somar as entradas
        let income = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income;
    },

    expenses() {
        // somar as saidas
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense;
    },

    total() {
        // entradas - saidas 
        return Transaction.incomes() + Transaction.expenses()

    }

}

// Precisa substituir os dados do html pelo os dados do JS. 

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addtransaction(transaction, index) { // index - seria onde ele vai colocar está transação ou indexação.
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLtransaction(transaction, index) // Dentro do innerHTML deste <tr> estou colocando o resto da table que está aqui em abaixo na outra função.
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLtransaction(transaction, index) { // Está apagado o transaction porque significa que ele existe ali, mais, não está sendo usando dentro das chaves da função.
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'
        
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `

            <td class="description">${transaction.description}</td>
            <td  class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
            ` // As Templatestring aceita variaveis lá dentro //

        return html // Uma função para que possa usa ela em outro lugar ou usa coisa dentro dela, eu preciso tirar coisas dentro dela através do return ou seja returna ou joga para fora o html no momento em que eu usa ele.
    },

    uptadeBalance() { // Vai mostra os valores a atualizados da entrada e saída
        document.getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes()) 
        
        document.getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses()) 

        document.getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total()) 
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g,'')) * 100
        return value
        
    },

    formatDate(date) {
        const splittedDate = date.split('-')
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
     
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''
        
        value = String(value).replace(/\D/g , '')

        value = Number(value) / 100
        
        value = value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value, 
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField() {
        const { description, amount, date } = Form.getValues()
        
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }

    },

    formatValues() {
        let { description, amount, date } = Form.getValues()       
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date
        }
    },    

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateField()
            Form.formatValues()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            modal.close()            
        } catch (error) {
            alert(error.message)
        }

      
    }

}

const App = {
    init() {

        Transaction.all.forEach(function (transaction, index) {
            DOM.addtransaction(transaction, index)
        })
        
        DOM.uptadeBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()

    }
}

App.init()

