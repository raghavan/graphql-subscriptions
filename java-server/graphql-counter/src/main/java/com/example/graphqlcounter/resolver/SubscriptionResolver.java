package com.example.graphqlcounter.resolver;

import com.example.graphqlcounter.service.CounterService;
import graphql.kickstart.tools.GraphQLSubscriptionResolver;
import org.reactivestreams.Publisher;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionResolver implements GraphQLSubscriptionResolver {

    private final CounterService counterService;

    public SubscriptionResolver(CounterService counterService) {
        this.counterService = counterService;
    }

    public Publisher<Integer> counterUpdated() {
        return counterService.getOldCounterPublisher();
    }

    public Publisher<Integer> newCounterUpdated() {
        return counterService.getNewCounterPublisher();
    }
}
