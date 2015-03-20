var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');


var main = new UI.Card({
  title: 'GovTrack',
  subtitle: 'Track reps & bills!',
  body: 'Images by Alex Fuller & Lemon Liu from The Noun Project',
  action: {
    up: 'images/person_tiny.png',
    down: 'images/bill_tiny.png'
  }
});


var representatives = [{title: 'Klobuchar', subtitle: 'D (MN)', govtrack_id: '412242'}, {title: 'Franken', subtitle: 'D (MN)', govtrack_id: '412378'}, {title: 'Ellison', subtitle: 'D (MN)', govtrack_id: '412215'}];

var repMenu = new UI.Menu({
  sections: [{
    title: "Senators",
    items: representatives
  }]
});

repMenu.show();


repMenu.on('select', function(e) {
  
  var request = 'https://www.govtrack.us/api/v2/vote_voter/?person=' + e.item.govtrack_id + '&sort=-created';
  
  ajax(
    {
      url: request,
      type:'json'
    },
    function(data) {
      
      // Get the latest 3 votes for the selected representative
      var latest_votes = data.objects.slice(1,4);
      
      // Create the Card for detailed view
      var votesCard0 = new UI.Card({
        title: latest_votes[0].option.value,
        subtitle: latest_votes[0].vote.result,
        body: latest_votes[0].vote.question,
        scrollable: true
      });
      
      // Create the Card for detailed view
      var votesCard1 = new UI.Card({
        title: latest_votes[1].option.value,
        subtitle: latest_votes[1].vote.result,
        body: latest_votes[1].vote.question,
        scrollable: true
      });

      
      votesCard0.show();
      votesCard1.show();

    },
    function(error) {
      console.log(error);
    }
  );
});

main.show();

main.on('click', 'up', function() {
  repMenu.show();
});