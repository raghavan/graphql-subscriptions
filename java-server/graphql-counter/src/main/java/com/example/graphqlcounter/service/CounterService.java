package com.example.graphqlcounter.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import javax.annotation.PostConstruct;

@Service
public class CounterService {

    private int oldCounter = 0;
    private int newCounter = 0;

    // Sinks that replay the latest value to new subscribers.
    private final Sinks.Many<Integer> oldCounterSink = Sinks.many().replay().latest();
    private final Sinks.Many<Integer> newCounterSink = Sinks.many().replay().latest();

    @PostConstruct
    public void init() {
        // Emit initial values so new subscribers get the current state.
        oldCounterSink.tryEmitNext(oldCounter);
        newCounterSink.tryEmitNext(newCounter);
    }

    // Queries
    public int getOldCounter() {
        return oldCounter;
    }

    public int getNewCounter() {
        return newCounter;
    }

    // Mutations
    public int incrementOldCounter() {
        oldCounter++;
        oldCounterSink.tryEmitNext(oldCounter);
        return oldCounter;
    }

    public int incrementNewCounter() {
        newCounter++;
        newCounterSink.tryEmitNext(newCounter);
        return newCounter;
    }

    // Subscriptions
    public Flux<Integer> getOldCounterPublisher() {
        return oldCounterSink.asFlux();
    }

    public Flux<Integer> getNewCounterPublisher() {
        return newCounterSink.asFlux();
    }
}
