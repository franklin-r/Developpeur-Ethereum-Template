Projet 2 - Tester un Contrat Intelligent
====================================

Méthodologie
-------------

# Fixtures
Les fixtures permettent de se placer dans un état particulier pour pouvoir tester différentes fonctionnalités.

## deployContractFixture
Se place après le déploiement du contrat intelligent.

## addVoterFixture
Reprend la fixture précédente et enregistre quatre adresses :
    * addr1
    * addr2
    * addr3
    * addr4

## addProposalFixture
Reprend la fixture précédente, débute la phase d'enregistrement des propositions et en enregistre trois :
    * addr1 : "Bitcoin"
    * addr2 : "Ethereum"
    * addr3 : "Solana"

## betweenProposalsRegistrationAndVotingFixture
Reprend la fixture précédente et termine la phase d'enregistrement des propositions.

## setVoteFixture
Reprend la fixture précédente et, débute la phase de vote et fait voter trois adresses :
    * addr1 : proposition d'indice 2
    * addr2 : proposision d'indice 1
    * addr3 : proposition d'indice 1

## betweenVotingSessionAndVotesTalliedFixture
Reprend la fixture précédente et termine la phase de vote.

## votesTalliedFixture
Reprend la fixture précédente et procède au comptage des voix.

# Tests
Les tests sont divisés en plusieurs contextes :

## constructor
Test autours du constructeur. Vérifie que :
**Deployer should be owner** : Le déployeur du contrat en est le propriétaire.

## Voters Registration Stage
Tests autours de la fonction addVote() et de la phase d'enregistrement des voteurs. Vérifient que :
**Should revert if other account registers an address** : La fonction va reverter si une personne autre que le propriétaire du contrat essaye d'enregistrer une adresse.
**Should not revert if owner registers an account** : La fonction ne va pas reverter si le propriétaire enregistre une adresse.
**Should not register the same address twice** : Une adresse ne peut pas être enregistrée plusieurs fois.
**Should register a voter** : Une adresse sera correctement enregistrée.
**Should emit event after voter registration** : Un évènement sera bien émis après l'enregistrement.
**Should revert if trying to make proposal** : On ne peut pas faire de propositions.
**Should revert if trying to vote** : On ne peut pas voter.
**Should revert if trying to tally votes** : On ne peut pas compter les voix.

## Proposals Registration Stage
Tests autours de la fonction addProposal() et de la pahse d'enregistrement des propositions. Vérifient que :
**Should revert if unregistered account makes a proposal** : La fonction va reverter si une adresse non-enregistrée essaye de faire une proposition.
**Should not revert if registered account makes a proposal** : La fonction ne pas reverter si une adresse enregistrée fait une proposition.
**Should revert if empty proposal** : La fonction va reverter si la proposition est vide.
**Should register proposal** : La proposition sera enregistrée correctement.
**Should not revert if same address makes two proposals** : La fonction ne pas reverter si une adresse fait deux propositions.
**Should not revert if same proposal twice** : La fonction ne va pas reverter si la même proposition est faite deux fois.
**Should emit event after proposal registration** : Un évènement sera bien émis après l'enregistrement.
**Should revert if trying to register voter** : On ne peut pas enregistrer d'adresses.
**Should revert if trying to vote** : On ne peut pas voter.
**Should revert if trying to tally votes** : On ne peut pas compter les voix.

## Voting Stage
Tests autours de la fonction setVote() et de la phase de vote. Vérifient que :
**Should revert if unregistered account votes** : La fonction va reverter si une adresse non-enregistrée essaye de voter.
**Should not revert if registered account votes** : La fonction ne va pas reverter si une adresse enregistrée essaye de voter.
**Should revert if trying to vote twice** : La fonction va reverter si une adresse essaye de voter deux fois.
**Should revert if voting for unexisting proposal** : La fonction va reverter si on essaye de voter pour une proposition qui n'existe pas.
**Should not revert if voting for existing proposal** : La fonction ne va pas reverter si on vote pour une proposition existante.
**Should update voter's data after vote** : Les informations du voteur seront mises à jour correctement.
**Should update proposal's vote count after vote** : Les informations de la propositions seront mises à jour correctement.
**Should emit event after vote** : Un évènement sera bien émis après le vote.
**Should revert if trying to register voter** : On ne peut pas enregistrer d'adresses.
**Should revert if trying to make proposal** : On ne peut pas faire de propositions.
**Should revert if trying to tally votes** : La fonction va reverter si on essaye de compter les voix.

## Tally Stage
Tests autours de la fonction tallyVotes(). Vérifient que :
**Should revert if other account tallies votes** : La fonction va reverter si une personne autre que le propriétaire essaye de faire le compte des voix.
**Should not revert if owner tallies votes** : La fonction ne va pas reverter si le propriétaire fait le compte des voix.
**Should find correct winning proposal id** : La bonne propositions gagnante est trouvée.

## Workflow Status Change
Tests autours des fonctions de chanegement d'état.

### From Voters Registration To Proposals Registration
Tests autours du changement entre la phase d'enregistrement des adresses et celles d'enregistrement des propositions. Vérifient que :
**Should revert if other account start proposal registration** : La fonction va reverter si une autre adresse que celle du propriétaire débute la phase d'enregistrement des propositions.
**Should not revert if owner start proposal registration** : La fonction ne va pas reverter si le propriétaire débute la phase.
**Should become ProposalsRegistrationStarted** : La phase sera mise à jour correctement.
**Should create 'GENESIS' proposal** : La proposition 'GENESIS' sera bien créée.
**Should emit event after start of proposal registration** : Un évènement sera bien émis après le changement de phase.
**Should revert if ending proposal registration** : On ne peut pas terminer la phase d'enregistrement des propositions.
**Should revert if starting voting session** : On ne peut pas débuter la phase de vote.
**Should revert if ending voting session** : On ne peut terminer la phase de vote.

### From Proposal Registration to After Proposal Registration
Tests autours du changement entre la phase d'enregistrement des propositions et la fin de celle-ci. Vérifient que :
**Should revert if other account end proposal registration** : La fonction va reverter si une autre adresse que celle du propriétaire essaye de termine la phase de propositions.
**Should not revert if owner end proposal registration** : La fonction ne va pas reverter si le propriétaire termine la phase.
**Should become ProposalsRegistrationEnded** : La phase sera mise à jour correctement.
**Should emit event after end of proposal registration** : Un évènement sera bien émis après le changement de phase.
**Should revert if starting proposal registration** : On ne peut pas débuter la phase s'enregistrement des propositions.
**Should revert if starting voting session** : On ne peut pas débuter la phase de vote.
**Should revert if ending voting session** : On ne peut terminer la phase de vote.

### From After Proposal Registration to Voting Session
Tests autours du passage à la phase de vote. Vérifient que :
**Should revert if other account start voting session** : La fonction va reverter si une autre adresse que celle du propriétaire essaye de débuter la phase de vote.
**Should not revert if owner start voting session** : La fonction ne va pas reverter si le propriétaire débute la phase.
**Should become VotingSessionStarted** : La phase sera mise à jour correctement.
**Should emit event after start of voting session** : Un évènement sera bien émis après le changement de phase.
**Should revert if starting proposal registration** : On ne peut pas débuter la phase s'enregistrement des propositions.
**Should revert if ending proposal registration** : On ne peut pas terminer la phase d'enregistrement des propositions.
**Should revert if ending voting session** : On ne peut terminer la phase de vote.

### From Voting Session to After Voting Session
Tests autours de la fin de la phase de vote. Vérifient que :
**Should revert if other account end voting session** : La fonction va reverter si une autre adresse que celle du propriétaire essaye de terminer la phase de vote.
**Should not revert if owner end voting session** : La fonction ne va pas reverter si le propriétaire termine la phase.
**Should become VotingSessionEnded** : La phase sera mise à jour correctement.
**Should emit event after end voting session** : Un évènement sera bien émis après le changement de phase.
**Should revert if starting proposal registration** : On ne peut pas débuter la phase s'enregistrement des propositions.
**Should revert if ending proposal registration** : On ne peut pas terminer la phase d'enregistrement des propositions.
**Should revert if starting voting session** : On ne peut pas débuter la phase de vote.

### From After Voting Session To Votes Tallied
Tests autours de la phase de fin de comptage des voix. Vérifient que :
**Should become VotesTallied** : La phase sera mise à jour correctement.
**Should emit event after votes tallied** : Un évènement sera bien émis après le changement de phase.
**Should revert if starting proposal registration** : On ne peut pas débuter la phase s'enregistrement des propositions.
**Should revert if ending proposal registration** : On ne peut pas terminer la phase d'enregistrement des propositions.
**Should revert if starting voting session** : On ne peut pas débuter la phase de vote.
**Should revert if ending voting session** : On ne peut terminer la phase de vote.

## Getters
Tests autours des getters.

### getVoter
Tests autours de la fonction getVoter(). Vérifient que :
**Should revert if unregistered account gets voter** : La fonction va reverter si une adresse non-enregistrée essaye d'obtenir des informations sur un voteur.
**Should not revert if registered account gets voter** : La fonction ne pas reverter si un voteur enregistré essaye d'obtenir des informations sur un voteur.
**Should return correct voter's data** : La fonction retourne les informations correctes concernant un voteur.

### GetOneProposal
Tests autours de la fonction getOneProposal(). Vérifient que :
**Should revert if unregistered account gets proposal** : La fonction va reverter si une adresse non-enregistrée essaye d'obtenir des informations sur une proposition.
**Should not revert if registered account gets proposal** La fonction ne pas reverter si un voteur enregistré essaye d'obtenir des informations sur une proposition.
**Should return correct proposal's data** : La fonction retourne les informations correctes concernant une proposition.
**Should revert if proposal does not exist** : La fonction va reverter si la proposition demandée n'existe pas.


Résultats
---------

## Tests
L'ensemble des tests (75) sont vérifiés et exécutés en 1s.

## Coverage
Les tests offrent une couverture totale, soit :

| File        |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Lines |
| :---------: | :------: | :------: | :------: | :------: | :-------------: |
| contracts/  |      100 |      100 |      100 |      100 |                 |
|  Voting.sol |      100 |      100 |      100 |      100 |                 |
| All files   |      100 |      100 |      100 |      100 |                 |