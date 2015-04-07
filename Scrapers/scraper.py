from lxml import html
import requests
from pymongo import MongoClient

class Game:
	title = ""
	loosePrice = ""
	completePrice = 0
	newPrice = 0
	genre = ""

	def __init__(self, title):
		self.title = title
	def setLoosePrice(self, loosePrice):
		self.loosePrice = loosePrice
	def setCompletePrice(self, completePrice):
		self.completePrice = completePrice
	def setNewPrice(self, newPrice):
		self.newPrice = newPrice
	def setGenre(self, genre):
		self.genre = genre


client = MongoClient('mongodb://localhost/')
db = client.nodeAuth

titles = []
exceptions = []
games = []
loosePrices = []
pageLength = 0
sonic = "/game/gamecube/sonic-adventure-2-battle"
###########################
#playstation-2 66
#gamecube 21
#nintendo-ds 59
#nintendo-64 12
#wii 46
#playstation 44
#super-nintendo 25
#nes 28
###########################
for x in range(0, 12):
	print 'page {}'.format(x)
	page = requests.get('http://videogames.pricecharting.com/console/nintendo-64?page='+str(x))
	tree = html.fromstring(page.text)
	#print tree
	#This will create a list of titles:
	tempTitles = tree.xpath('//td[@class="title"]/a/text()')
	genres = tree.xpath('//td[@class="genre"]/text()')
	link = tree.xpath('//td[@class="title"]/a/@href')
	#titles = titles+tempTitles
	############################
	pageLength = len(tempTitles)
	############################
	for y in range(0, len(tempTitles)):
		#games.append(Game(tempTitles[y]))
		#print str(link[y])
		#if str(link[y]) != sonic:
		itemPage = requests.get('http://videogames.pricecharting.com'+str(link[y]))
		try:
			itemTree = html.fromstring(itemPage.text)
			loosePrice = itemTree.xpath('//td[@id="used_price"]/span[@class="price"]/text()')
			completePrice = itemTree.xpath('//td[@id="complete_price"]/span[@class="price"]/text()')
			newPrice = itemTree.xpath('//td[@id="new_price"]/span[@class="price"]/text()')
			console = itemTree.xpath('//*[@id="product_name"]/a/text()')
			upc = itemTree.xpath('//*[@id="product_details"]/p/span[1]/span/text()')
			loosePrice[0] = loosePrice[0].strip().strip('$')
			completePrice[0] = completePrice[0].strip().strip('$')
			newPrice[0] = newPrice[0].strip().strip('$')
			upc[0] = upc[0].strip()
			#print '{}, {}, {}, {}'.format(tempTitles[y], loosePrice[0], completePrice[0], newPrice[0])
			# games[ (x*pageLength)+y ].setLoosePrice( loosePrice[0] )
			# games[ (x*pageLength)+y ].setCompletePrice( completePrice[0] )
			# games[ (x*pageLength)+y ].setNewPrice( newPrice[0] )


			#print '{}, {}, {}, {}'.format(tempTitles[y], loosePrice[0], completePrice[0], newPrice[0])
			#store the game in the database
			game = {"title": tempTitles[y],
			"loose_price": loosePrice[0],
			"cib_price": completePrice[0],
			"new_price": newPrice[0],
			"genre": genres[y],
			"console": console[0],
			"upc": upc[0]}
			post_id = db.games.save(game)
		except Exception as exc:
			exceptions.append(str(link[y]))
			print(tempTitles[y]+" IS BROKEN")
			print exc

		#loosePrices = loosePrices + loosePrice
		#print games[x+y-1].completePrice

client.disconnect()
print "Exceptions:"
for anException in exceptions:
	print anException
# for aGame in games:
# 	#print '{}, {}, {}, {}'.format(game.title, game.loosePrice, game.completePrice, game.newPrice)
# 	game = {"title": aGame.title,
# 	"loose_price": aGame.loosePrice,
# 	"cib_price": aGame.completePrice,
# 	"new_price": aGame.newPrice}
# 	post_id = db.games.insert(game)

#print db.collection_names()
#print 'Titles: ', titles
#print 'Prices: ', prices

#for title in titles:
#	print title
