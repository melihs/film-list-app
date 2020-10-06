let searchController = {
    init: function () {
        this.defaultImage = "./assets/img/no-image.jpg";
        this.key = "7ddb68cb&s";
        this.url = "http://www.omdbapi.com";
        this.favoriteList = JSON.parse(localStorage.getItem('favorites')) || [];
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
        getFavorites();
        formSubmit(this.doms.searchForm, this.doms.searchText, this.doms.elmSearchResult);
    },
    functions: {
        formSubmit: formSubmit = (searchForm, searchText, elmSearchResult) => {
            searchForm.on('submit', (e) => {
                getMovies(searchText, elmSearchResult);

                window.scrollTo(0, -60);

                e.preventDefault();
            })
        },
        getMovies: getMovies = (searchText, elmSearchResult) => {
            fetch(`${searchController.url}/?i=tt3896198&apikey=${searchController.key}=${searchText.val()}`)
                .then(response => response.json())
                .then(data => {
                    let movies = data.Search;

                    elmSearchResult.empty();

                    $.each(movies, (index, movie) => {
                        image = (movie.Poster == 'N/A') ? searchController.defaultImage : movie.Poster;
                        output = filmCard({
                            poster: image,
                            title: movie.Title,
                            year: movie.Year,
                            imdbID: movie.imdbID,
                            iconClass: 'far',
                            iconColor: '',
                        });

                        elmSearchResult.append(output);
                    });
                    setFavorite();
                })
                .catch(err => console.error(err));
        },
        filmCard: filmCard = ({ poster, title, year, imdbID, iconClass, iconColor }) => {
            const elmCardDiv = $(`<div class='col-md-4 mb-4 card-${imdbID}'>`).css("display", "flex");

            const elmCard = $(`<div class='card box-${imdbID}'>`).appendTo(elmCardDiv);

            const elmImg = $("<img>").attr({
                src: poster,
                alt: '..',
                width: "80",
                height: "280",
                class: "card-img-top",
            }).appendTo(elmCard);

            const elmCardBody = $("<div class='card-body'>").appendTo(elmCard);

            const elmH = $("<h5 class='card-title'>")
                .appendTo(elmCardBody)
                .css("font-size", "24px")
                .text(title);

            const elmP = $("<p class='card-text pb-3'>").appendTo(elmCardBody)

            const elmCardFooter = $("<div class='card-footer'>").appendTo(elmCard);

            const elmReleaseDate = $("<small class='text-muted float-left'>")
                .appendTo(elmCardFooter)
                .text(`Çıkış Tarihi: ${year}`);

            const elmSpanFav = $("<small class='text-muted float-right'>").appendTo(elmCardFooter);

            const elmIcon = $(`<i class='${iconClass} fa-heart fa-2x'>`)
                .attr('id', `${imdbID}`)
                .css({ 'cursor': "pointer", 'color': `${iconColor}` })
                .appendTo(elmSpanFav);

            return elmCardDiv[0];
        },
        getFavorites: getFavorites = () => {
            searchController.favoriteList.forEach(function (favorite) {
                fetch(`${searchController.url}?i=${favorite}&apikey=${searchController.key}`)
                    .then(response => response.json())
                    .then(data => {
                        let result = filmCard({
                            poster: data.Poster,
                            title: data.Title,
                            year: data.Year,
                            imdbID: data.imdbID,
                            iconClass: 'fas',
                            iconColor: 'red',
                        });
                        $('#favorites').append(result);
                    })
                    .catch(err => console.error(err));
            });
            document.querySelector('#favorites').addEventListener('click', function (e) {
                let id = e.target.id;

                let removeIndex = searchController.favoriteList.findIndex(list => list === id);

                searchController.favoriteList.splice(removeIndex, 1);

                localStorage.setItem('favorites', JSON.stringify(searchController.favoriteList));

                if (!id) return;

                $('body #' + id).css('color', '').removeClass("fas").addClass("far");

                $('#favorites .card-' + id).remove();
            });
        },
        setFavorite: setFavorite = () => {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

            favorites.forEach(function (favorite) {
                let favIcon = document.getElementById(favorite);

                if (favIcon && favIcon.className) {
                    favIcon.className = 'fas fa-heart fa-2x';
                    favIcon.style.color = 'red';
                }
            });

            document.querySelector('#searchResult').addEventListener('click', function (e) {
                let id = e.target.id,
                    item = e.target,
                    index = favorites.indexOf(id);

                if (!id) return;

                if (index == -1) {

                    favorites.push(id);

                    searchController.favoriteList = favorites;

                    item.className = 'fas fa-heart fa-2x';

                    item.style.color = 'red';

                    !$('#favorites .card-' + id).length ? $('.card-' + id).clone().appendTo($('#favorites')) : null;

                } else {
                    favorites.splice(index, 1);

                    item.className = 'far fa-heart fa-2x';

                    item.style.color = '';

                    $('#favorites .card-' + id).remove();
                }
                localStorage.setItem('favorites', JSON.stringify(favorites));
            })
        },
        cardEffect: cardEffect = (cardId) => {
            let className, cardClass;

            $('.card-' + cardId).mouseover(function () {
                cardClass = $('.box-' + cardId);

                className = cardClass[0].classList[1];

                $(`.${className}`).css('box-shadow', '0 1rem 2rem black');
            });
            $('.box-' + cardId).mouseout(function () {
                $(`.${className}`).css('box-shadow', '');
            });
        },
    }
}

searchController.init();
$(document).ready(function () {
    searchController.onload();
});