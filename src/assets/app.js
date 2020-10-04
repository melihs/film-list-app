let searchController = {
    init: function () {
        this.defaultImage = "./assets/img/no-image.jpg";
        this.key = "7ddb68cb&s";
        this.url = "http://www.omdbapi.com/?i=tt3896198&";
        this.favorites;
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

                        updateFavorite(movie.imdbID);
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
                let favoriteCard = JSON.parse(localStorage.getItem("favorite"));

                currentCardClass = event.target.parentElement.parentElement.parentElement.parentElement.classList[2];

                if (!favoriteCard) {
                    favoriteList.push({ 'class': currentCardClass, 'status': true });

                    lStorage.setItem("favorite", JSON.stringify({ 'favs': favoriteList }));

                    currentCard = $("." + currentCardClass).clone();

                    favorites = $('#favorites');

                    currentCard.appendTo(favorites);

                    $('#' + filmId).css('color', 'red').addClass('fas').removeClass('far');
                }

                if (favoriteCard) {
                    if (favoriteCard.status && filmId !== favoriteCard.class) {
                        favoriteList.push({ 'class': currentCardClass, 'status': false });

                        localStorage.setItem("favorite", JSON.stringify({ 'favs': favoriteList }));

                        $("#favorites ." + currentCardClass).remove();

                        currentCard = $("." + currentCardClass);

                        $('#favorites').html(currentCard);

                        $('* #' + filmId).css('color', 'red').addClass('far').removeClass('fas');
                    }
                    if (favoriteCard.status && "card-" + filmId !== favoriteCard.class) {
                        favoriteList.push({ 'class': currentCardClass, 'status': false });

                        localStorage.setItem("favorite", JSON.stringify({ 'favs': favoriteList }));

                        icon.css('color', 'red').addClass('far').removeClass('fas');
                    }
                    if (!favoriteCard.status) {
                        if ("card-" + filmId === favoriteCard.class) {
                            currentCard = $("." + currentCardClass).clone();

                            $('#favorites').html(currentCard);

                            $('body #' + filmId).css('color', 'red').addClass('fas').removeClass('far');
                        }

                        if ("card-" + filmId !== favoriteCard.class) {
                            let checkFav = checkFavCard(favoriteList, filmId);

                            if (checkFav && checkFav.check) {
                                localStorage.setItem("favorite", JSON.stringify({ 'favs': checkFav.result }));
                            }

                            favoriteList.push({ 'class': currentCardClass, 'status': true });

                            localStorage.setItem("favorite", JSON.stringify({ 'favs': favoriteList }));

                            icon.css('color', 'red').addClass('far').removeClass('fas');
                        }
                    }
                }
            });
        },
        updateFavorite: updateFavorite = (filmId) => {
            let favoriteCard = JSON.parse(localStorage.getItem("favorite"));

            if (!favoriteCard) return;

            favoriteCard.favs.forEach((card) => {
                if ("card-" + filmId === card.class && card.status) {
                    currentCard = $('.' + card.class).clone();

                    favorites = $('#favorites');

                    $(`#${filmId}`).css('color', 'red').addClass('fas').removeClass('far');

                    currentCard.appendTo(favorites);
                }
            });
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
        checkFavCard: checkFavCard = (favoriteList, cardId) => {
            let result;
            favoriteList.forEach((item) => {
                if (item.class === 'card-' + cardId) {
                    item.status = false;

                    result = { 'result': favoriteList, 'check': true };
                }

                if (item.class !== 'card-' + cardId) {
                    result = false;
                }
            });
        }
    }
}

searchController.init();
const favoriteList = [];
$(document).ready(function () {
    searchController.onload();
});