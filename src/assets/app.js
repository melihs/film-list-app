let searchController = {
    init: function () {
    },
    onload: function () {
        this.doms = {
            searchForm: $('#searchForm'),
            searchText: $('#searchText'),
            elmSearchResult: $('#searchResult'),
        }
        this.bindActions();
    },
    bindActions: function () {
        formSubmit(this.doms.searchForm, this.doms.searchText, this.doms.elmSearchResult);
    },
    functions: {
        getMovies: getMovies = (searchText, elmSearchResult) => {
            key = "7ddb68cb&s=",
                url = "http://www.omdbapi.com/?i=tt3896198&";

            fetch(url + "apikey=" + key + searchText.val() + "&format=json")
                .then(response => response.json())
                .then(data => {
                    let movies = data.Search;
                    elmSearchResult.empty();

                    $.each(movies, (index, movie) => {
                        let image = movie.Poster == 'N/A' ? "./assets/img/no-image.jpg" : movie.Poster;

                        output = filmCard(image, movie.Title, movie.Year);

                        elmSearchResult.append(output);
                    });
                })
                .catch(err => console.error(err));
        },
        formSubmit: formSubmit = (searchForm, searchText, elmSearchResult) => {
            searchForm.on('submit', (e) => {
                getMovies(searchText, elmSearchResult);

                e.preventDefault();
            })
        },
        filmCard: filmCard = (imageSource, cardTitleText, releaseDate) => {
            const elmCardDiv = $("<div class='col-md-4 mb-4'>").css("display", "flex");

            const elmCard = $("<div class='card'>").appendTo(elmCardDiv);

            const elmImg = $("<img>").attr({
                src: imageSource,
                alt: '..',
                width: "80",
                height: "280",
                class: "card-img-top",
            }).appendTo(elmCard);

            const elmCardBody = $("<div class='card-body'>").appendTo(elmCard);

            const elmH = $("<h5 class='card-title'>").appendTo(elmCardBody).css("font-size", "24px").text(cardTitleText);

            const elmP = $("<p class='card-text pb-3'>").appendTo(elmCardBody)

            const elmCardFooter = $("<div class='card-footer'>").appendTo(elmCard);

            const elmReleaseDate = $("<small class='text-muted float-left'>").appendTo(elmCardFooter).text(`Çıkış Tarihi: ${releaseDate}`);

            const elmSpanFav = $("<small class='text-muted float-right'>").appendTo(elmCardFooter);

            const elmIcon = $("<i class='far fa-heart fa-2x'>").appendTo(elmSpanFav);

            return elmCardDiv[0];
        },
        searchHistory: searchHistory = (searchText) => {

        }
    }
}

searchController.init();

$(document).ready(function () {
    searchController.onload();
});