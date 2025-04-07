package com.example.graphqlcounter.resolver;

import com.example.graphqlcounter.service.CounterService;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Component;

@Component
public class MutationResolver implements GraphQLMutationResolver {

    private final CounterService counterService;

    public MutationResolver(CounterService counterService) {
        this.counterService = counterService;
    }

    public int incrementCounter() {
        return counterService.incrementOldCounter();
    }

    public int incrementNewCounter() {
        return counterService.incrementNewCounter();
    }
}
