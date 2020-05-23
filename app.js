document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	const miniGrid = document.querySelector('.mini-grid')
	const startBtn = document.querySelector('#start')
	const scoreDisplay = document.querySelector('#score')
	const gridNum = 200;
	let timerId
	//"Width of the grid"
	let nextRandom = 0
	const width = 10;
	let score = 0

	const colors = [
		'cyan',
		'yellow',
		'magenta',
		'blue',
		'orange',
		'lime',
		'red'
	]
	
	// Create the Grid
	for (var i = 0; i < gridNum; i++) {
		let newSquare = document.createElement('div');
		grid.appendChild(newSquare);
	}

	// Create a line of "taken"
	for (var i = 0; i < 10; i++) {
		let newTakenSquare = document.createElement('div');
		newTakenSquare.classList.add('taken');
		grid.appendChild(newTakenSquare);
	}

	// Create a grid for upcoming Tetrominos
	for(var i = 0; i < 16 ; i++){
		let miniSquare = document.createElement('div');
		miniGrid.appendChild(miniSquare);
	}

	let squares = Array.from(document.querySelectorAll('.grid div'))
	console.log(squares)

	// Define Default Positions of All Tetrominos
	const ITetrominoDefault = [width , width + 1, width + 2, width + 3]
	const OTetrominoDefault = [0, 1, width, width + 1]
	const TTetrominoDefault = [1, width, width + 1, width + 2]
	const JTetrominoDefault = [0, width, width + 1, width + 2]
	const LTetrominoDefault = [width, width + 1, width + 2, 2]
	const STetrominoDefault = [width, width + 1, 1, 2]
	const ZTetrominoDefault = [0, 1, width + 1, width + 2]

	//Defining all possible rotations of the Tetrominoes
	const ITetromino = [
    	ITetrominoDefault,
    	[2 , width + 2, width * 2 + 2, width * 3 + 2],
    	[width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3],
    	[1,width+1,width*2+1,width*3+1]
	]

	const OTetromino = [
		OTetrominoDefault,
		OTetrominoDefault,
		OTetrominoDefault,
		OTetrominoDefault
	]
	
	const TTetromino = [
		TTetrominoDefault,
    	[1, width + 1, width + 2, width * 2 + 1],
    	[width, width + 1, width + 2,width * 2 + 1],
    	[1, width, width + 1, width * 2 + 1]
	]
	
	const JTetromino = [
		JTetrominoDefault,
		[1 , width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2 + 1, width * 2],
	]
	
	const LTetromino = [
		LTetrominoDefault,
		[1 , width + 1, width * 2 + 1, width * 2 + 2],
		[width, width + 1, width + 2, width * 2],
		[0 , 1, width + 1, width * 2 + 1]
	]

	const STetromino = [
		STetrominoDefault,
		[1, width + 1, width + 2, width * 2 + 2],
		[width * 2, width * 2 + 1, width + 1, width + 2],
		[0, width, width + 1, width * 2 + 1]
	]

	const ZTetromino = [
		ZTetrominoDefault,
		[2, width + 1, width + 2, width * 2 + 1],
		[width, width + 1, width * 2 + 1, width * 2 + 2],
		[1, width, width + 1, width * 2]
	]

	// Define an Array of All Possible Tetrominos and Rotations
	const theTetrominoes = [ITetromino, OTetromino, TTetromino, JTetromino, LTetromino, STetromino, ZTetromino]
	

	// Default Rotation
	let currentRotation = 0

	// Define the Current Position on the Grid, default = 4
	let currentPosition = 4
	
	// Determine random Tetromino
	let random = Math.floor(Math.random() * theTetrominoes.length);
	
	// Define the randomly chosen Tetromino and it's rotation
	var current = theTetrominoes[random][currentRotation]
	console.log(current)

	function draw(){
		console.log("before")
		console.log(currentPosition)
		console.log(squares)
		console.log("After")
		current.forEach(index => {
			console.log("CI")
			console.log(currentPosition + index)
			squares[currentPosition + index].classList.add('tetromino')
			squares[currentPosition + index].style.backgroundColor = colors[random]
		})
	}

	function undraw(){
		current.forEach(index => {
			squares[currentPosition + index].classList.remove('tetromino')
			squares[currentPosition + index].style.backgroundColor = ''
		})
	}

	// = setInterval(moveDown, 1000);


	//Assign Keycode Functions
	function control(e){
		switch(e.keyCode){
			case 37:
				moveLeft()
				break;
			case 39:
				moveRight()
				break;
			case 38:
				rotate()
				break;
			case 40:
				moveDown()
				break;
			case 90:
				rotateReverse()
			 	break;
		}

	}

	document.addEventListener('keydown' , control)


	function moveDown(){
		console.log(squares)
		undraw()
		currentPosition += width
		draw()
		freeze()

	}

	function freeze(){
		if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
			current.forEach(index => squares[currentPosition + index].classList.add('taken'))
			random = nextRandom
			nextRandom = Math.floor(Math.random() * theTetrominoes.length)
			current = theTetrominoes[random][currentRotation]
			currentPosition = 4
			draw()
			displayShape()
			addScore()
			gameOver()
		}
	}

	function moveLeft(){
		undraw()
		const isAtLeftEdge = current.some(index =>(currentPosition + index) % width === 0)
		if(!isAtLeftEdge) currentPosition -= 1
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
			currentPosition += 1
		}
		draw()
	}


	function moveRight(){
		undraw()
		const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
		if(!isAtRightEdge) currentPosition += 1

		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
			currentPosition -= 1
		}
		draw()
	}

	function rotate(){
		undraw()
		currentRotation++
		if(currentRotation === current.length){
			currentRotation = 0;
		}

		current = theTetrominoes[random][currentRotation]
		draw()
	}

	function rotateReverse(){
		undraw()
		currentRotation--
		if(currentRotation === -1){
			currentRotation = current.length - 1;
		}

		current = theTetrominoes[random][currentRotation]
		draw()
	}


	const displaySquares = document.querySelectorAll('.mini-grid div')
	const displayWidth = 4
	let displayIndex = 0

	// Define Array of Default Tetromino Positions
	const UpNextTetrominos = [
		[displayWidth, displayWidth + 1, displayWidth + 2, displayWidth + 3],
	 	[displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2],
	 	[displayWidth + 1, displayWidth * 2, displayWidth * 2 + 1, displayWidth * 2 + 2],
	 	[displayWidth, displayWidth * 2, displayWidth * 2 + 1, displayWidth * 2 + 2],
	 	[displayWidth * 2, displayWidth * 2 + 1, displayWidth * 2 + 2, displayWidth + 2],
	 	[displayWidth * 2, displayWidth * 2 + 1, displayWidth + 1, displayWidth + 2 ],
	 	[displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2]
	 ]
	
	//Display the next Tetromino in the minigrid
	function displayShape(){
		displaySquares.forEach(square => {
			square.classList.remove('tetromino')
			square.style.backgroundColor = ''
		})
		UpNextTetrominos[nextRandom].forEach( index => {
			displaySquares[displayIndex + index].classList.add('tetromino')
			displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
		})
	}

	startBtn.addEventListener('click', () => {
		if(timerId){
			clearInterval(timerId)
			timerId = null
		}else{
			draw()
			timerId = setInterval(moveDown, 1000)
			nextRandom = Math.floor(Math.random() * theTetrominoes.length)
			displayShape()
		}
	})

	function addScore(){
		for(let i = 0; i < gridNum; i += width){
			const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

			if(row.every(index => squares[index].classList.contains('taken'))){
				score += 10;
				scoreDisplay.innerHTML = score
				row.forEach(index =>{
					squares[index].classList.remove('taken')
					squares[index].classList.remove('tetromino')
					squares[index].style.backgroundColor = ''
				})
				const squaresRemoved = squares.splice(i, width)
				squares = squaresRemoved.concat(squares)
				squares.forEach(cell => grid.appendChild(cell))
			}
		}
	}

	function gameOver(){
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
			scoreDisplay.innerHTML = 'Game Over'
			clearInterval(timerId)
		}
	}


})