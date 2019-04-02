const patternDict = [{
    pattern: '\\b(?<greeting>Bonjour|Wassup|Hi|Hello|Hey)\\b',
    intent: 'Hello'
  },
  
  {
    pattern: '\\b(Bye|Exit|Kill|ByeBye)\\b',
    intent: 'Exit'
  },
  {
    pattern: '\\b(iss.+now|iss.+location)\\b',
    intent: 'IssNow'
  },
  {
    pattern: '\\b(people.+space)\\b',
    intent: 'PeopleSpace'
  },
  {
    pattern: '\\b(meteor.+)\\bfrom.\\b(?<city>.+)',
    intent: 'Meteor'
  }
  
  ];
  
  module.exports = patternDict;
  