# Appleseed Search Web

Appleseed Search Web are a collection of web interfaces for the Appleseed Search Platform ( part of the [Appleseed Framework](http://www.appleseedapp.com) ).
They are used to connect and retrieve results from Elastic, SolR, and Lucene (Legacy) indexes populated by Appleseed Search.

##Features##

* Single Page Applications 
* AngularJS Based (AngularJS 1.5 w/ Components /AngularJS 2 Coming)
* Quickstart search for Elastic Search
* Quickstart search for SolR 

#Where it began#

When trying to bring up a search engine interface for one of our clients at [Anant](https://www.anant.us/), 
I looked for different ways to get a simple interface to look at results that weren't in JSON from Elastic or SolR.
I found some good libraries, but the problem was the same. All the things needed to get started in open source search 
were on the internet, but it takes forever to do anything useful. 

##TODOs##

The goal of Appleseed Search is to make it the *easiest* toolkit to get a search project started. This sub project's goal is to make 
it easy to get a search interface talking to existing indexes, but also as a reference to customize and configure. 

#Interface#

* TODO: Rebuild Appleseed.Search.Web.User.NgSolr w/ FountainJS Generator
* TODO: Rebuild Appleseed.Search.Web.User.NgElastic w/ FountainJS Generator

#Software#

* TODO: Abstract AngularJS Components for Elastic/SolR 
* TODO: Abstract AngularJS Service Layer for Elastic/SolR
* TODO: Implement unit tests w/ Karma
* TODO: One Web Interface with Configuration that can work with both Elastic/SolR 

#Data/Database#
* TODO: Abstract REST/Data layer to work with Elastic/SolR/etc. 

#Systems#
* TODO: Add support for Algolia, Azure Search, Amazon Search 

This project is a collection of subprojects built over time at [Anant](https://www.anant.us/) by different [team members](https://www.anant.us/Company.aspx). 
