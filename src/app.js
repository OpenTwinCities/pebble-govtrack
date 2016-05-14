var UI = require('ui');
var ajax = require('ajax');


var main = new UI.Card({
  title: 'GovTrack',
  subtitle: 'Track reps & bills!',
  body: 'Brought to you by: Open Twin Cities',
  action: {
    up: 'images/person_tiny.png',
    select: "images/music_icon_ellipsis.png",
    down: 'images/bill_tiny_bw.png'
  }
});

main.show();

// ABOUT INFO DISPLAY
var aboutCard = new UI.Card({
  title: 'About OTC:',
  subtitle: 'http://www.opentwincities.org/',
  body: 'Data: GovTrack, https://www.govtrack.us/ \nImages: Alex Fuller & Simple Icons @ The Noun Project',
  icon: 'images/otc_bw.png',
  scrollable: true
});

main.on('click', 'select', function() {
  aboutCard.show();
});
  

// REPRESENTATIVES MENU DISPLAY
var representatives = [{title: 'Klobuchar', subtitle: 'D (MN)', govtrack_id: '412242'}, {title: 'Franken', subtitle: 'D (MN)', govtrack_id: '412378'}, {title: 'Ellison', subtitle: 'D (MN)', govtrack_id: '412215'}];

var repMenu = new UI.Menu({
  sections: [{
    title: "Representatives",
    items: representatives
  }]
});


main.on('click', 'up', function() {
  repMenu.show();
});


repMenu.on('select', function(e) {
  
  var request = 'https://www.govtrack.us/api/v2/vote_voter/?person=' + e.item.govtrack_id + '&sort=-created';
  
  ajax(
    {
      url: request,
      type:'json'
    },
    function(data) {
      
      // Get the latest 10 votes for the selected representative
      var latest_votes = data.objects.slice(1,11);
      
      var votesMenu = new UI.Menu();
      for (var i = 0; i < 10; i++) {
        votesMenu.item(0, i, { title: latest_votes[i].option.value ,
                               subtitle: latest_votes[i].vote.question ,
                               result: latest_votes[i].vote.result ,
                               timestamp: latest_votes[i].vote.created ,
                               total_plus: latest_votes[i].vote.total_plus ,
                               total_minus: latest_votes[i].vote.total_minus ,
                               total_other: latest_votes[i].vote.total_other         
                               } );
      }
      
      votesMenu.show();
      
      votesMenu.on("select", function(e) {
        var voteCard = new UI.Card({
          title: e.item.title,
          subtitle: e.item.subtitle,
          body: "RESULT: " + e.item.result + "\n(+" + e.item.total_plus + "\/-" + e.item.total_minus + "\/" + e.item.total_other + ")\nTIME: " + e.item.timestamp,
          scrollable: true
        });
        
        voteCard.show();
      });

    },
    function(error) {
      console.log(error);
    }
  );
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
      
      // Get the latest 15 bills that have recent status updates
      var latest_bills = data.objects.slice(1,16);
      
      var billsMenu = new UI.Menu();
      for (var i = 0; i < 15; i++) {
        billsMenu.item(0, i, { title: latest_bills[i].display_number , 
                               subtitle: latest_bills[i].title_without_number , 
                               bill_id: latest_bills[i].id ,
                               introduced_date: latest_bills[i].introduced_date ,
                               current_status_date: latest_bills[i].current_status_date ,
                               current_status_label: latest_bills[i].current_status_label ,
                               current_status_description: latest_bills[i].current_status_description ,
                               sponsor: latest_bills[i].sponsor.name ,
                               title_without_number: latest_bills[i].title_without_number } );
      }
      
      billsMenu.show();
      
      billsMenu.on("select", function(e) {
        var billCard = new UI.Card({
          title: e.item.title,
          subtitle: e.item.sponsor,
          body: e.item.title_without_number + "\nSTATUS: " + e.item.current_status_label + "(" + e.item.current_status_date + ")" + "\nINTRODUCED: " + e.item.introduced_date,
          scrollable: true
        });
        
        billCard.show();
      });   
    
    }, 
    function(error) {
      console.log(error);
    }
  );           
});