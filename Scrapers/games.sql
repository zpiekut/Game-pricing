USE games;

DROP TABLE IF EXISTS games;
CREATE TABLE books
(
  id              int unsigned NOT NULL, 	# Unique ID for the record
  console         varchar(255) NOT NULL,    # The console the game is on
  title           varchar(255) NOT NULL,    # Full title of the game
  loose_price     decimal(10,2) NOT NULL,   # The loose price
  complete_price  decimal(10,2) NOT NULL,   # The complete price
  new_price       decimal(10,2) NOT NULL,   # The new price
  genre           varchar(255) NOT NULL,    # Genre the game is in

  PRIMARY KEY     (id)
);
