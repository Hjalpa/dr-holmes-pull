// ==UserScript==
// @name          Leader Board Rankings
// @namespace     Dr. Holmes
// @description   Adds leader board rankings on the profile page
// @include       http://tagpro-*.koalabeast.com/profile/*
// @author        Dr. Holmes
// @version       1.0
// ==/UserScript==

$(document).ready(function(){
    var rankDay = [],
        rankWeek = [],
        rankMonth = [],
        
        $day = $('<div>'),
        $week = $('<div>'),
        $month = $('<div>'),
        
        myName = $('body h3:nth-child(2)').html().split('<div>')[0];
    
    
    $day.load('/boards article #Day .board tbody', function(){
        rankDay = getRank($day,rankDay);
    });
    $week.load('/boards article #Week .board tbody', function(){
        rankWeek = getRank($week,rankWeek);
    });
    $month.load('/boards article #Month .board tbody', function(){
        rankMonth = getRank($month,rankMonth);
    });
    
    setTimeout(function(){
        if (rankDay || rankWeek || rankMonth){
            var rankDayHTML = '<span class="rank">'+rankDay[0]+'</span><span class="plusminus"> [+'+rankDay[1]+'/-'+rankDay[2]+']</span>';
            var rankWeekHTML = '<span class="rank">'+rankWeek[0]+'</span><span class="plusminus"> [+'+rankWeek[1]+'/-'+rankWeek[2]+']</span>';
            var rankMonthHTML = '<span class="rank">'+rankMonth[0]+'</span><span class="plusminus"> [+'+rankMonth[1]+'/-'+rankMonth[2]+']</span>';
            
            if(!rankDay){
                rankDayHTML = '';
            } else if (!rankWeek){
                rankWeekHTML = '';
            } else if (!rankMonth){
                rankMonthHTML = '';
            }
            
            $('table:eq(0) th:eq(1)').before('<th>Rank</th>');
            $('table:eq(0) tr:eq(1) td:eq(0)').before('<td>'+rankDayHTML+'</td');
            $('table:eq(0) tr:eq(2) td:eq(0)').before('<td class="alt">'+rankWeekHTML+'</td>');
            $('table:eq(0) tr:eq(3) td:eq(0)').before('<td>'+rankMonthHTML+'</td>');
            $('table:eq(0) tr:eq(4) td:eq(0)').before('<td class="alt"></td>');
            
            $('table:eq(0) .plusminus').css('fontSize', '60%');
            $('table:eq(0) .rank').css('color', '#00FF00');
        }
    },1000);
    
    
    function getRank(div,rank){
        for (i=0; i<div.find('tr').length; i++){
            var name = div.find('tr:eq('+i+') td:eq(1)').text();
            if (name == myName){
                var plus,
                    minus,
                    points;
                
                points = parseInt(div.find('tr:eq('+i+') td:eq(2)').text());
                plus = parseInt(div.find('tr:eq('+(i-1)+') td:eq(2)').text()) -points;
                minus = points - parseInt(div.find('tr:eq('+(i+1)+') td:eq(2)').text());
                
                rank = [];
                rank.push(i);
                rank.push(plus);
                rank.push(minus);
            }
            else if (!rank[1]){
                rank = false;
            }
                }
        return rank;
    }
});
