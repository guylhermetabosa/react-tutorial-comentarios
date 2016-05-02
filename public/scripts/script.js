var data = [
  {id: 1, autor: "Guylherme Tabosa", texto: "Este foi um comentário"},
  {id: 2, autor: "João da Silva", texto: "Este foi *outro* comentário"},
  {id: 3, autor: "José Feitosa", texto: "Este foi *mais* um comentário"},
  {id: 4, autor: "Toim Felix", texto: "Este foi *um* comentário"},
  {id: 5, autor: "Eudimar Antunes", texto: "Este foi *um baita* comentário"}
];

var Comentario = React.createClass({

 	  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },


	render: function(){
		return (
			<div className="comment">
				<h2 className="commentAuthor">{this.props.autor}</h2>
			  	<span dangerouslySetInnerHTML={this.rawMarkup()} />
			</div>
		)
	}

});


var FormComentario = React.createClass({

	render: function(){
		return (
			<div className="commentForm">
				<form>
					<input type="text" placeholder="Nome" />
					<input type="text" placeholder="Comentário" />
					<input type="submit" value="Comentar" />
				</form>
			</div>
		)
	}

});


var ListaComentario = React.createClass({

	render: function(){

		var comentarios = this.props.data.map(function(comentario){
			return (
				<Comentario autor={comentario.autor} key={comentario.id}>{comentario.texto}</Comentario>
			)
		});

		return (
			<div className="commentList">
				{comentarios}
			</div>
		)
	}

});


var BoxComentario = React.createClass({

	getInitialState: function() {
	    return {
	        data: []  
	    };
	},

	carregaComentariosServer: function(){
	      $.ajax({
	      	url: this.props.url,
	      	dataType: 'json',
	      	cache: false,
	      	success: function(data){
	      		this.setState({data:data});
	      	}.bind(this),
	      	error: function(xhr, status, error){
	      		console.error(this.props.url, status, error.toString());
	      	}.bind(this)

	      });
	},

	componentDidMount: function() {
		this.carregaComentariosServer();
		setInterval(this.carregaComentariosServer, this.props.updateTime);
	},


	render: function(){
		return(
			<div className="commentBox">
				<h1> Comentários </h1>
				<ListaComentario data={this.state.data} />
				<FormComentario />
			</div>
		);
	}

});

ReactDOM.render(<BoxComentario url="/api/comentarios" updateTime={2500}/>,
 	document.getElementById('content')
 );