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
        getSearchHistory();
        cancelSearchItem();
        savedSearch(this.doms.elmSearchResult);
        formSubmit(this.doms.searchForm, this.doms.searchText, this.doms.elmSearchResult);
    },
    functions: {
        formSubmit: formSubmit = (searchForm, searchText, elmSearchResult) => {
            const elmNotify = $("<div>").attr('id', 'notify').addClass("alert alert-danger").text('Minimum 3 karakter girmelisiniz!');
            $("input").on("keyup", function (e) {
                let charLength = $(this).val().length;

                if (charLength >= 3 || charLength == 0) {
                    $('#notify').remove()

                    $('#searchBtn').prop('disabled', false);


                } else {
                    elmNotify.prependTo($('#searchForm'));

                    $('#searchBtn').prop('disabled', true);
                }
            });

            searchForm.on('submit', (e) => {
                getMovies(searchText.val(), elmSearchResult);

                setSearchHistory(searchText);

                window.scrollTo(0, -60);

                e.preventDefault();
            })
        },
        getMovies: getMovies = (searchText, elmSearchResult) => {
            fetch(`${searchController.url}/?i=tt3896198&apikey=${searchController.key}=${searchText}`)
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

            const elmCard = $("<div>").addClass("card card-h").appendTo(elmCardDiv);

            const elmImg = $("<img>").attr({
                src: poster,
                alt: '..',
                width: "80",
                height: "280",
                class: "card-img-top",
            }).appendTo(elmCard);

            const elmCardBody = $("<div class='card-body'>").appendTo(elmCard);

            const elmH = $("<h5 class='card-title text-dark'>")
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
                        output = filmCard({
                            poster: data.Poster,
                            title: data.Title,
                            year: data.Year,
                            imdbID: data.imdbID,
                            iconClass: 'fas',
                            iconColor: 'red',
                        });
                        $('#favorites').append(output);
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
        getSearchHistory: getSearchHistory = () => {
            const tag = (buttonText) => {
                const elmButton = $('<button>')
                    .attr('id', 'btn-' + buttonText)
                    .addClass('btn btn-light border border-secondary mb-2 ml-2')
                    .attr('type', 'button')
                    .text(buttonText);

                const elmSpan = $('<span>')
                    .attr('id', buttonText)
                    .addClass('badge badge-light float-right ml-4')
                    .text('x')
                    .appendTo(elmButton);

                return elmButton;
            }
            $('#searchHistory').empty();

            let searchs = JSON.parse(localStorage.getItem('searchs')) || [];

            searchs.forEach(function (search) {
                tag(search).appendTo($('#searchHistory'));
            });
        },
        setSearchHistory: setSearchHistory = (searcText) => {
            let searchs = JSON.parse(localStorage.getItem('searchs')) || [],
                keyword = $.trim(searcText.val()),
                checkSearchItem = searchs.find((item) => item === keyword);

            if (searchs.length >= 10) return;

            if (!checkSearchItem) {
                searchs.push(keyword);

                localStorage.setItem('searchs', JSON.stringify(searchs));

                getSearchHistory(searchs);
            }
        },
        cancelSearchItem: cancelSearchItem = () => {
            document.querySelector('#searchHistory').addEventListener('click', function (e) {
                let id = e.target.id,
                    target = $(e.target);

                if (!target.is("span")) return;

                if (!id) return;

                let searchs = JSON.parse(localStorage.getItem('searchs')) || [],
                    result = searchs.filter(val => val != id);

                localStorage.setItem('searchs', JSON.stringify(result));

                e.path[1].remove();
            });
        },
        savedSearch: savedSearch = (elmSearchResult) => {
            document.querySelector('#searchHistory').addEventListener('click', function (e) {
                let target = $(e.target);

                if (!target.is("button")) return;

                let searchKeyword = e.target.id.substring(4);

                getMovies(searchKeyword, elmSearchResult);
            });
        }
    }
}

searchController.init();
$(document).ready(function () {
    searchController.onload();
});