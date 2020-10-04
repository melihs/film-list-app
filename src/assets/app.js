let searchController = {
    init: function () {
        this.defaultImage = "./assets/img/no-image.jpg";
        this.key = "7ddb68cb&s";
        this.url = "http://www.omdbapi.com/?i=tt3896198&";
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
            fetch(`${searchController.url}apikey=${searchController.key}=${searchText.val()}&format=json`)
                .then(response => response.json())
                .then(data => {
                    let movies = data.Search;

                    elmSearchResult.empty();

                    $.each(movies, (index, movie) => {
                        image = movie.Poster == 'N/A' ? searchController.defaultImage : movie.Poster;

                        output = filmCard(image, movie.Title, movie.Year, movie.imdbID);

                        elmSearchResult.append(output);

                        setFavorite(movie.imdbID);
                        cardEffect(movie.imdbID);
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
        filmCard: filmCard = (imageSource, cardTitleText, releaseDate, filmId) => {
            const elmCardDiv = $(`<div class='col-md-4 mb-4 card-${filmId}'>`).css("display", "flex");

            const elmCard = $(`<div class='card box-${filmId}'>`).appendTo(elmCardDiv);

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

            const elmIcon = $("<i class='far fa-heart fa-2x'>").attr('id', `${filmId}`).css('cursor', 'pointer').appendTo(elmSpanFav);

            return elmCardDiv[0];
        },

        setFavorite: setFavorite = (filmId) => {
            let icon = $(`#${filmId}`),
                currentCardClass,
                currentCard;

            icon.on('click', (event) => {
                currentCardClass = event.target.parentElement.parentElement.parentElement.parentElement.classList[2];

                currentCard = $(`.${currentCardClass}`).clone();

                $('#favorites').append(currentCard);

                icon.css('color', 'red').addClass('fas').removeClass('far');
            });
        },
        cardEffect: cardEffect = (testID) => {
            let className, cardClass;

            $('.card-' + testID).mouseover(function () {
                cardClass = $('.box-' + testID);

                className = cardClass[0].classList[1];

                $(`.${className}`).css('box-shadow', '0 1rem 2rem black');
            });
            $('.box-' + testID).mouseout(function () {
                $(`.${className}`).css('box-shadow', '');
            });
        },
    }
}

searchController.init();

$(document).ready(function () {
    searchController.onload();
});