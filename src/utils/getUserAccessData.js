const getUserAccessData = (predicate) => {

    let funds = [];
    let branchs = [];
    let investors = [];
    let distributors = [];
    
    const regexPattern = /\((.*?)\)/g

    const resultArray = predicate.match(regexPattern);

    for (var i = 0; i < 4; i++) 
    {
      const myresult = resultArray[i].replace(/[("")]/g, '');
      const resultSplit = myresult.split(',');

      if (i === 0) funds = resultSplit;
      else if (i === 1) branchs = resultSplit;
      else if (i == 2) investors = resultSplit;
      else if (i === 3) distributors = resultSplit;
    }

    return ({ funds, branchs, investors, distributors });
}