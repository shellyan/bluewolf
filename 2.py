__author__ = 'shellyan'
"""
Find the first non-repeating character in a string:("DEFD" -> E )

Assuming case not sensitive
"""

import unittest



def findCharacter(string):
    string = string.upper()
    for letter in string:
        if string.count(letter)==1:
            return letter


class TestFindCharacter(unittest.TestCase):
    def setUp(self):
        pass

    def test_one(self):
        self.assertEqual(findCharacter('DEFD'),'E')

    def test_two(self):
        self.assertEqual(findCharacter('DEdsfnjxkgcjdsfrwerFD'),'N')





if __name__ == '__main__':
    unittest.main()




