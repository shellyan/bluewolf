__author__ = 'shellyan'
"""
Given an array of integers between 1 and 1,000,000. One integer is in the array twice.

Find the duplicate.
"""
import unittest

def findDulpicate(array):

    sortedArray = sorted(array)
    duplicate = sortedArray[0]
    for item in sortedArray[1:]:
        if duplicate == item:
            return duplicate
        duplicate = item



class TestFindDuplicate(unittest.TestCase):
    def setUp(self):
        pass

    def test_one(self):
        self.assertEqual(findDulpicate([1,2,3,3,4]),3)




if __name__ == '__main__':
    unittest.main()

