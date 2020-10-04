let  searchController = {
    init: function () {
    },
    onload: function () {
        this.doms = {
            searchForm: $('#searchForm'),
        }
        this.bindActions();
    },
    bindActions: function () {
        formSubmit(this.doms.searchForm);
    },
    functions: {
        getMovies: getMovies = (searchText) => {
            const elmSearchResult = $('.search-result');

            axios.get('http://www.omdbapi.com/?i=tt3896198&apikey=7ddb68cb&s=' + searchText)
                .then((response) => {

                    let movies = response.data.Search;

                    elmSearchResult.empty();

                    $.each(movies, (index, movie) => {
                        let image = movie.Poster == 'N/A' ? "./assets/img/download.png" : movie.Poster;

                        output = filmCard(image, movie.Title, movie.Year);

                        elmSearchResult.append(output);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        formSubmit: formSubmit = (searchForm) => {
            searchForm.on('submit', (e) => {
                getMovies($('#searchText').val());

                e.preventDefault();
            })
        },
        filmCard : filmCard = (imageSource, cardTitleText, releaseDate) => {
            const elmCardDiv = $("<div class='col-md-4 mb-4'>").css("display", "flex");

            const elmCard = $("<div class='card'>").appendTo(elmCardDiv);

            const elmImg = $("<img>").attr({
                id: 'id1',
                src: imageSource,
                alt: '..',
                width: "80",
                height: "280",
                class: "card-img-top",
            }).appendTo(elmCard);

            const elmCardBody = $("<div class='card-body'>").appendTo(elmCard);

            const elmH = $("<h5 class='card-title'>").appendTo(elmCardBody).css("font-size", "2vw").text(cardTitleText);

            const elmP = $("<p class='card-text pb-3'>").appendTo(elmCardBody)

            const elmCardFooter = $("<div class='card-footer'>").appendTo(elmCard);

            const elmReleaseDate = $("<small class='text-muted float-left'>").appendTo(elmCardFooter).text(`Çıkış Tarihi: ${releaseDate}`);

            const elmSpanFav = $("<small class='text-muted float-right'>").appendTo(elmCardFooter);

            const elmIcon = $("<i class='far fa-heart fa-2x'>").appendTo(elmSpanFav);

            return elmCardDiv[0];
        }
    }
}

searchController.init();

$(document).ready(function (){
    searchController.onload();
});