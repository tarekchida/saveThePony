/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var maze = {
    apiUrl: "https://ponychallenge.trustpilot.com/pony-challenge/",
    id: "",
    width: "",
    hight: "",
    init: function () {
        $("input.slider").slider({tooltip: 'show'});
        maze.id = "";
        maze.width = "";
        maze.hight = "";
        $('.maze-pony').hide();
        $('.maze-init').show();
        $('#maze-form').submit(function (event) {
            event.preventDefault();
            var params = new Object();
            params['maze-width'] = parseInt($('#mazeWidth').val());
            params['maze-height'] = parseInt($('#mazeHeight').val());
            params['maze-player-name'] = $('input[name="mazePlayerName"]:checked').val();
            params.difficulty = parseInt($('#difficulty').val());


            var apiResponse = maze.apiRequest(JSON.stringify(params), 'POST', 'maze');

            maze.id = apiResponse.maze_id;
            maze.width = parseInt($('#mazeWidth').val());
            maze.hight = parseInt($('#mazeHeight').val());
            maze.star();
            return false;
        });

    },
    star: function () {
        $('.maze-init').hide();
        maze.consoleMsg("Maze Started");
        $('.maze-pony').show();
        var mazeStatus = maze.apiRequest({}, 'GET', 'maze/' + maze.id);
        if (mazeStatus['game-state'].state == "Active") {
            maze.print();
        } else {
            maze.init();
        }

    },
    print: function () {

        var mazePrint = maze.apiRequest({}, 'GET', 'maze/' + maze.id + '/print');
        console.log(mazePrint);
        $('.game-container').text(mazePrint);
    },
    getDirection: function () {
        $(document).keydown(function (e) {
            switch (e.which) {
                case 37:
                    maze.consoleMsg("Move : left");
                    break;

                case 38:
                    maze.consoleMsg("Move : Up");
                    break;

                case 39:
                    maze.consoleMsg("Move : Right");
                    break;

                case 40:
                    maze.consoleMsg("Move : Down");
                    break;

                default:
                    return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    },
    /**
     * 
     * @param {type} params
     * @param {type} type
     * @param {type} url
     * @returns {data}
     */
    apiRequest: function (params, type, url) {
        var apiResponse = {};
        $.ajax({
            type: type,
            url: maze.apiUrl + url,
            data: params,
            Accept: 'application/json',
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType: "json",
            async: false,
            success: function (data, status, jqXHR) {
                apiResponse = data
            },
            error: function (jqXHR, status) {
                console.log(jqXHR);
            }
        });
        return apiResponse;
    },
    consoleMsg: function (msg) {
        $('.mase-console').scrollspy();

        $('.mase-console').append(msg + "<br/>");
    }

};
$(document).ready(function () {
    maze.init();
    maze.getDirection();
});
