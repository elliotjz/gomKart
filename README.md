# gomkart

-----------

### An app for competitive Mariokart

[ Demo Deployment ](https://gomkart.herokuapp.com)

**How to use it:**
* Make a tournament
* Add players to the tournament
* Record race results
* Look at the statistics

**How the scoring works:**

The scoring system uses the [ELO Rating System](https://en.wikipedia.org/wiki/Elo_rating_system) to calculate players' scores. Each player starts with 200 points, and the system will update their scores after each race. Each player will gain or loose points depending on which players they won against, drew with, or lost to.

For example, if a player with `500` points races against a player with `100` points, the scoring system would determine that the stronger player has a `97.5%` chance of winning. The system then compares that expected result with the actual result and transfers points between the players accordingly.  
If the stronger player wins, they would take `0.125` points off of loosing player. If the players drew with each other, the stronger player would give `2.375` points to the weaker player. If the stronger player lost, they would give `4.875` points to the weaker player.

The scoring system does this calculation for every pair of players in a race, including comparing players with the computer players, and adjusting the computer player scores accordingly.
