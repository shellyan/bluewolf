__author__ = 'shellyan'
"""
A standard deck of 52 cards is represented in an array. Each card is represented as an

integer. Write a method to shuffle the cards.

"""
import random,unittest

def shuffle(deck):
    for i in reversed(xrange(1, len(deck))):
            # pick an card in deck[:i+1] with which to exchange deck[i]
            j = int(random.random() * (i+1))
            deck[i], deck[j] = deck[j], deck[i]
    return deck


class TestShuffle(unittest.TestCase):
    def setUp(self):
        self.deck = [x for x in range(52)]

    def testCaseOne(self):
        self.assertEqual(len(shuffle(self.deck)),52)



if __name__ == '__main__':
    unittest.main()


