// ==UserScript==
// @name          Leader Board Rankings
// @namespace     Dr. Holmes
// @description   Adds leader board rankings on the profile page
// @include       http://tagpro-*.koalabeast.com/profile/*
// @author        Dr. Holmes
// @version       1.0
// ==/UserScript==

$(document).ready(function(){
	var day = [],
		week = [],
		month = [],
		
		rankDay = [],
		rankWeek = [],
		rankMonth = [],
		
		$day = $('<div>'),
		$week = $('<div>'),
		$month = $('<div>'),
		
		myName = 'yippie'//$('body h3:nth-child(2)').html().split('<div>')[0],
		$table = $('table:eq(0)');
		
		
	$day.load('/boards article #Day .board tbody', function(){
		getRank($day, day, rankDay);
	});
	$week.load('/boards article #Week .board tbody', function(){
		getRank($week, week, rankWeek);
	});
	$month.load('/boards article #Month .board tbody', function(){
		getRank($month, month, rankMonth);
	});
	
	rankRewrite(rankDay);
	rankRewrite(rankWeek);
	rankRewrite(rankMonth);
	
	$('table:eq(0) th:eq(1)').before('<th>Rank</th>');
	$('table:eq(0) tr:eq(1) td:eq(0)').before('<td>'+rankDay+'</td>');
	$('table:eq(0) tr:eq(2) td:eq(0)').before('<td class="alt">'+rankWeek+'</td>');
	$('table:eq(0) tr:eq(3) td:eq(0)').before('<td>'+rankMonth+'</td>');
	$('table:eq(0) tr:eq(4) td:eq(0)').before('<td class="alt"></td>');
	
	
	function getRank(div, list, rank){
		for (i=0; i<100; i++){
			var templist =[];
			templist.push(div.find('tr:eq('+i+') td:eq(1)').text());
			templist.push(div.find('tr:eq('+i+') td:eq(2)').text());
			list.push(templist);
		}
		for (i=0; i<100; i++){
			if (list[i][0] == myName){
				rank.push(i);
				rank.push(list[i-1][1]-list[i][1]);
				rank.push(list[i][1]-list[i+1][1]);
			}
		}
	}
	
	function rankRewrite(rank){
		if (rank[0]){
			rank = rank[0]+' ['+rank[1]+', '+rank[2]+']';
		}
		else {
			rank = 'NA';
		}
	}
});
