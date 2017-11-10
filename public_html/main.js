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
    /**
     * 
     * @returns {undefined}
     */
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
    /**
     * 
     * @returns {undefined}
     */
    star: function () {
        $('.maze-init').hide();
        maze.consoleMsg("Maze Started", 'success');
        $('.maze-pony').show();
        var mazeStatus = maze.apiRequest({}, 'GET', 'maze/' + maze.id);
        if (mazeStatus['game-state'].state == "Active") {
            maze.print();
        } else {
            maze.init();
        }

    },
    /**
     * 
     * @returns {undefined}
     */
    print: function () {

        var mazePrint = maze.apiRequest({}, 'GET', 'maze/' + maze.id + '/print');
        console.log(mazePrint);

    },
    /**
     * 
     * @returns {undefined}
     */
    getDirection: function () {
        $(document).keydown(function (e) {
            switch (e.which) {
                case 37:
                    maze.consoleMsg("Move : left", 'info');
                    break;

                case 38:
                    maze.consoleMsg("Move : Up", 'info');
                    break;

                case 39:
                    maze.consoleMsg("Move : Right", 'info');
                    break;

                case 40:
                    maze.consoleMsg("Move : Down", 'info');
                    break;

                default:
                    return;  
            }
            e.preventDefault();  
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
                return apiResponse = data

            },
            error: function (jqXHR, status) {
                console.log(jqXHR);
            }
        });
        return apiResponse;
    },
    /**
     * 
     * @param {type} msg
     * @returns {undefined}
     */
    consoleMsg: function (msg, type ) {
        $('.maze-console').scrollspy();

        $('.maze-console').append("<p class='alert-"+type+"'>"+msg + "</p>");
    }

};
$(document).ready(function () {
    maze.init();
    maze.getDirection();
});
