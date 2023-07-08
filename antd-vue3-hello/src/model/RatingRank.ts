export enum RatingRank { 
  n1Star = 'n1Star', 
  n2Stars = 'n2Stars', 
  n3Stars = 'n3Stars', 
  n4Stars = 'n4Stars', 
  n5Stars = 'n5Stars', 
}

const survey_word_text = {
  'word.enum.RatingRank.n1Star': '1 star',
  'word.enum.RatingRank.n2Stars': '2 stars',
  'word.enum.RatingRank.n3Stars': '3 stars',
  'word.enum.RatingRank.n4Stars': '4 stars',
  'word.enum.RatingRank.n5Stars': '5 stars',
};

// helpers
type key_of_survey_word_text = keyof typeof survey_word_text;

function survey_word_text_for(prefix: string, code: string){
  return survey_word_text[<key_of_survey_word_text>(prefix+code)];
}

export { survey_word_text, survey_word_text_for };
