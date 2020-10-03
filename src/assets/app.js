$(document).ready(() =>{
	$('#searchForm').on('submit',(e) => {
		let searchText = $('#searchText').val();
		getMovies(searchText);
		e.preventDefault();
	});
});
function getMovies(searchText){
	axios.get('http://www.omdbapi.com/?i=tt3896198&apikey=7ddb68cb&s='+searchText)
		.then((response) => {
			console.log(response);
			let movies = response.data.Search;
			let output = '';
			$.each(movies, (index, movie) => {
				output += ` <div class="col-md-4 mb-4">
            <div class="card">
            <img src="${movie.Poster}" width="80" height="280" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${movie.Title}</h5>
              <p class="card-text pb-3">
                <small class="text-muted float-left">ÇIKIŞ TARİHİ</small>
                <small class="text-muted float-right">RATİNG</small>
              </p>
              <p class="card-text">içerik</p>
            </div>
            <div class="card-footer">
              <small class="text-muted float-right">
                <i class="far fa-heart fa-2x"></i></small>
            </div>
          </div>
          </div>
`;
			});
			$('.search-result').html(output);
		})
		.catch((err) => {
			console.log(err);
		});
}