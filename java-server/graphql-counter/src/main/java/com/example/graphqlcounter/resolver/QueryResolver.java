package com.example.graphqlcounter.resolver;

import com.example.graphqlcounter.service.CounterService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.stereotype.Component;

@Component
public class QueryResolver implements GraphQLQueryResolver {

    private final CounterService counterService;

    public QueryResolver(CounterService counterService) {
        this.counterService = counterService;
    }

    public int counter() {
        return counterService.getOldCounter();
    }

    public int newCounter() {
        return counterService.getNewCounter();
    }
}
