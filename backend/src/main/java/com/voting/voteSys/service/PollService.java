package com.voting.voteSys.service;

import com.voting.voteSys.Repository.PollRepository;
import com.voting.voteSys.model.OptionVote;
import com.voting.voteSys.model.Poll;
import org.apache.logging.log4j.util.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PollService {

    private final PollRepository pollRepository;

    public PollService(PollRepository pollRepository) {
        this.pollRepository = pollRepository;
    }

    public Poll createPoll(Poll poll) {
        return pollRepository.save(poll);
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }

    public Optional<Poll> getPollById(Long id) {
        return pollRepository.findById(id);
    }

    public void vote(Long pollId, int optionIndex) {

        // Get Poll from DB
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        // Get Options
        List<OptionVote> options = poll.getOptions();

        // Validate Index
        if(optionIndex < 0 || optionIndex >= options.size()) {
            throw new IllegalArgumentException("Invalid option index");
        }

        // Get Selected Option
        OptionVote selectedOption = options.get(optionIndex);

        // Increment vote for selected option
        selectedOption.setVoteCount(selectedOption.getVoteCount() + 1);

        // save to DB
        pollRepository.save(poll);
    }
}
