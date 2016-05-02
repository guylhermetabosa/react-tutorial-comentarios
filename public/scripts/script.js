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

	getInitialState: function() {
	    return {
	          autor: '', texto:''
	    };
	},

	handleAutorChange: function(event){
		var autor = event.target.value;
		this.setState({autor: autor});
	},

	handleComentarioChange: function(event){
		var comentario = event.target.value;
		this.setState({texto: comentario});
	},

	handleFormSubmit: function(event){
		event.preventDefault();

		var autor = this.state.autor.trim();
		var comentario = this.state.texto.trim();

		// console.log(autor);
		// console.log(comentario);
		if(!autor || !comentario){
			return;
		}

		this.props.onComentarioSubmit({autor: autor, texto: comentario});
		this.setState({autor: '', texto: ''});
	},


	render: function(){
		return (
				<form className="commentForm" onSubmit={this.handleFormSubmit}>
					<input type="text" placeholder="Nome" value={this.state.autor} onChange={this.handleAutorChange}/>
					<input type="text" placeholder="Comentário" value={this.state.texto} onChange={this.handleComentarioChange} />
					<input type="submit" value="Comentar" />
				</form>
			
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

	handleComentarioSubmit: function(comentario){
		var comentarios = this.state.data;
		console.log(comentario);
		comentario.id = Date.now();
		var novosComentarios = comentarios.concat([comentario]);
		this.setState({data: novosComentarios});
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: comentario,
			success: function(data){
				this.setState({data: data});
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
				<FormComentario onComentarioSubmit={this.handleComentarioSubmit}/>
			</div>
		);
	}

});

ReactDOM.render(<BoxComentario url="/api/comentarios" updateTime={2500}/>,
 	document.getElementById('content')
 );
