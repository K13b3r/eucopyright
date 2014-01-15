/* jshint strict: true, quotmark: false, es3: true */
/* global $: false, EUCopyright: false */

$(function(){
  "use strict";

  var specialCases = {
    teacher: {
      42: ['a'],
      47: ['a'],
      53: ['a']
    },
    business: {
      53: ['a', 'b'],
      58: ['b'],
      59: ['b'],
      60: ['b']
    },
    librarian: {
      28: ['a'],
      32: ['a', 'b'],
      36: ['a', 'b'],
      53: ['a']
    },
    blogger: {
      58: ['a'],
      59: ['a'],
      60: ['a']
    },
    disabled: {
      50: ['a', 'b']
    }
  };

  var personaQuestionMap = {
    general: [1, 4, 5, 11,12,13,14,20,21,22,23,24,25,26,64,65,67,68,71,77,80],
    onlineuser: [1, 4, 5, 11, 12, 13, 21,22,23,24,25,26,64,65,67,68,71,76,77,78],
    parent: [11, 12, 13, 21,22,23,24,25,26,64,65,67,68,71,77],
    teacher: [42,43,44,45,46,47,48,49, 53,54,55,56,57],
    business: [2,4,7,8,53,54,55,56,57,58,59,60,61,62,63,66,69],
    librarian: [28,29,30,32,33,34,36,37,38,39,40,41,15,16,17,18,19,20,21,22,23,24,25,53,54,55],
    blogger: [58,59,60,61,62,63],
    rightsholder: [9,10,14,72,73,74,15,16,17,18,66],
    disabled: [50,51,52]
  };
  var qIndex = {}, qCount = 0;
  var questionSections = $('.question-sections');
  var toggleSections = function() {
    var personas = [];
    $('.personas .thumbnail').each(function(i, el) {
      el = $(el);
      el.toggleClass('active', el.find('input').prop('checked'));
      if (el.hasClass('active')) {
        personas.push(el.attr('id').split('-')[1]);
      }
    });
    var groupObj = {}, personaQuestions, questionList = [];
    var addQuestions = function(persona){
      personaQuestions = personaQuestionMap[persona];
      for (var j = 0; j < personaQuestions.length; j += 1) {
        if (groupObj[personaQuestions[j]] === undefined) {
          groupObj[personaQuestions[j]] = true;
          questionList.push(personaQuestions[j]);
        }
      }
    };
    for (var i = 0; i < personas.length; i += 1) {
      addQuestions(personas[i]);
    }
    addQuestions('general');

    $('#persona-questions .question-section').removeClass('active').hide();
    for (i = 0; i < questionList.length; i += 1) {
      $('#persona-questions .question-section-' + questionList[i]).appendTo(questionSections).addClass('active').show();
    }
    qCount = $('.question-section.active').length;
    qIndex = {};
    $('.question-section.active').each(function(i, el){
      qIndex[$(el).attr('id')] = i;
    });
  };

  $('.personas .thumbnail input').change(function(){
    toggleSections();
    refreshScroll();
  });
  $('.delete-localstorage').show();
  $('#persona-questions').hide();
  $('.continue-questions').click(function(){
    $('#persona-questions').show();
    $progressBar.show();
    window.setTimeout(function(){
      refreshScroll();
    }, 100);
  });
  window.setTimeout(function(){
    toggleSections();
    loadGuide();
  }, 100);

  var $progressBar = $('#progress-bar').hide();
  $progressBar.css('width', $progressBar.parent().width() + 'px');

  var loadGuide = function(){
    var lang = $('html').attr('lang');
    var slug = 'c4c_' + lang;
    if (EUCopyright.answers[slug] !== undefined) {
      EUCopyright.loadGuide(slug);
    } else {
      EUCopyright.loadGuide('c4c_en');
    }
  };

  var offsets = $([]), targets = $([]);
  var $scrollElement = $(window);
  var activeTarget = null;
  var process = function(){
    var scrollTop    = $scrollElement.scrollTop();
    var scrollHeight = $scrollElement[0].scrollHeight;
    var maxScroll    = scrollHeight - $scrollElement.height();
    var i;

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && activate(i);
    }

    for (i = offsets.length; i--;) {
      if (activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1])) {
        activate(targets[i]);
      }
    }
  };
  var $progressBarSub = $progressBar.find('.progress-bar');
  var activate = function(target){
    if (qIndex[target] === undefined) { return; }
    $progressBarSub.attr({
      'aria-valuenow': qIndex[target],
      'aria-valuemin': 1,
      'aria-valuemax': qCount
    }).css('width', ((qIndex[target] + 1) / qCount * 100) + '%');
  };
  var refreshScroll = function(){
    offsets = $([]);
    targets = $([]);
    var offsetMethod = 'offset';
    $('body')
      .find('.q.active')
      .map(function () {
        var $el = $(this);
        return [[ $el[offsetMethod]().top + (!$.isWindow($scrollElement.get(0)) && $scrollElement.scrollTop()),
              $el.attr('id')]];
      })
      .sort(function (a, b) { return a[0] - b[0]; })
      .each(function () {
        offsets.push(this[0]);
        targets.push(this[1]);
      });
  };
  refreshScroll();
  $(window).resize(refreshScroll);
  $(window).on('scroll', process);
  loadGuide();
});
