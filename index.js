var parser = require('cellular-automata-rule-parser');

// var rule = parser('23/36'); // highlife
// var rule = parser('/2/3'); // brian's brain

var start = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]
var state = null
var ruleNumber = 30
var rule = null // wolfram's rule 30
updateParser()

setInterval(iterate, 16)
setInterval(nextParser, 2000)

function nextParser(){
  ruleNumber++
  updateParser()
}

function updateParser(){
  state = start.slice()
  rule = parser('W'+ruleNumber)
  console.log('rule number:', ruleNumber)
  var ruleSet = generateRuleSet(2, 3)
  renderRuleSet(ruleSet)
}

function renderRuleSet(ruleSet){
  var topRow = []
  var botRow = []
  ruleSet.forEach(function(rule){
    topRow = topRow.concat(['+'])
    botRow = botRow.concat(['+'])
    topRow = topRow.concat(rule.input.concat(['+']))
    botRow = botRow.concat(['+',rule.result,'+','+'])
  })
  renderRow(new Array(ruleSet.length*5+1).join('0').split(''))
  renderRow(topRow)
  renderRow(botRow)
  renderRow(new Array(ruleSet.length*5+1).join('0').split(''))

  // console.log(topRow.join(''))
  // console.log(botRow.join(''))
}

function generateRuleSet(stateSize, inputCount){
  // var stateSize = 2
  // var inputCount = 3
  var ruleCount = Math.pow(stateSize, inputCount)
  var rules = []
  for (var index = 0; index < ruleCount; index++) {
    
    var env = dec2bitArray(index, inputCount)
    var cell = env[1]
    var neighbors = [env[0],env[2]]
    var result = rule.process(cell, neighbors)
    // console.log('?', index, dec2bitArray(index, inputCount), result)
    rules.push({ input: env, result: result })
  }
  return rules
}

function iterate(){
  // render
  renderRow( state )
  
  // iterate
  var nextState = state.map(function(cell, index){
    
    // get environment
    var neighbors = 
      getNeighborIndexs(index, state.length)
      .map(function(neighborIndex){ return state[neighborIndex] })

    // console.log(index, '->', getNeighborIndexs(index, state.length))

    // state transition
    var next = rule.process(cell, neighbors)

    // update current cell
    return next

  })

  // update current state
  state = nextState
}

function renderRow( row ){
  var rows = row.map(function(cell){
      // console.log(cell)
    switch(cell) {
      case 1:
        return '▓'
      case 0:
        return ' '
      default:
        return '░'
    }
  })
  console.log(rows.join(''))
}

function getNeighborIndexs(index, length){
  var wrap = wrapInt(length)
  return [
    wrap(index-1),
    // wrap(index),
    wrap(index+1),
  ]
}

function wrapInt(max){
  return function(num){
    return mod(num, max)
  }
}

function mod(num, max) {
  return ((num%max)+max)%max
}

function dec2bin(dec, size){
  var bitString = (dec >>> 0).toString(2)
  var padding = new Array(size-bitString.length+1).join('0')
  // console.log('>', dec, '->', size-bitString.length, ')', padding, '+', bitString, '=', padding+bitString)
  return (padding+bitString)
}

function dec2bitArray(num, size){
  return dec2bin(num, size).split('').map(Number)
}


// var rule = parser('LUKY 3323'); // conway's life in luky format


// var rule = parser('S23/B3'); // classic conway's life rule
// console.log(rule.process(0, [0,0,0,0,0,0,0,0])); // 0
// console.log(rule.process(0, [1,1,1,0,0,0,0,0])); // 1
// console.log(rule.process(1, [1,1,0,0,0,0,0,0])); // 1
// console.log(rule.process(1, [1,1,1,1,0,0,0,0])); // 0


console.log(rule); // an object describing the rule
