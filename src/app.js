var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');


var main = new UI.Card({
  title: 'GovTrack',
  subtitle: 'Track reps & bills!',
  body: 'Images: Alex Fuller & Lemon Liu @ The Noun Project',
  action: {
    up: 'images/person_tiny.png',
    down: 'images/bill_tiny.png'
  }
});

main.show();


// REPRESENTATIVES MENU DISPLAY
var representatives = [{title: 'Klobuchar', subtitle: 'D (MN)', govtrack_id: '412242'}, {title: 'Franken', subtitle: 'D (MN)', govtrack_id: '412378'}, {title: 'Ellison', subtitle: 'D (MN)', govtrack_id: '412215'}];

var repMenu = new UI.Menu({
  sections: [{
    title: "Representatives",
    items: representatives
  }]
});

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

main.on('click', 'up', function() {
  repMenu.show();
});



// BILLS DISPLAY
main.on('click', 'down', function() {
  
  var request = 'https://www.govtrack.us/api/v2/bill?congress=114&sort=-current_status_date';
  
  ajax(
    {
      url: request,
      type:'json'
    },
    function(data) {
      
      // Get the latest 5 bills that have recent status updates
      var latest_bills = data.objects.slice(1,6);
      
      console.log(latest_bills);
      
      console.log(latest_bills[0].display_number);
      console.log(latest_bills[0].current_status_date);
      console.log(latest_bills[0].id);
      
      var latest_bills_menu = [];
      
      for (var b in latest_bills) {
        console.log(b);
        latest_bills_menu.push({
            title: b.display_number,
            subtitle: b.current_status_date,
            bill_id: b.id
        });
      }
      
      console.log(latest_bills_menu[0].title);
      console.log(latest_bills_menu[0].subtitle);
      console.log(latest_bills_menu[0].bill_id);
      
      
      // Create a menu to display latest bills
      var billsMenu = new UI.Menu({
        sections: [{
          title: "Recent Bills",
          items: latest_bills_menu
        }]
      });
      
      billsMenu.show();
      
    
    }, 
    function(error) {
      console.log(error);
    }
  );
           
});