
import { BaseExecutor, Executor } from "../executor.js"


export default class extends BaseExecutor implements Executor {

    cmd(): string {
        return 'perl'
    }

    template(definition: string, fArgs: string, fResult: string): string {
        return `
#!/usr/bin/perl
use strict;
use warnings;
use JSON;
use File::Slurp;

# Input and output file paths
my $input_file = '${fArgs}';
my $output_file = '${fResult}';

# Read the JSON input from a file
my $json_string = read_file($input_file) or die "Could not read $input_file: $!";

# Decode the JSON string into a Perl data structure
my $data = decode_json($json_string);

# Define the function as a string
my $function_string = q{
    sub {
        ${definition};
    }
};

# Evaluate the string to define the function
my $arbitrary_function = eval $function_string;

# Check for errors in eval
if ($@) {
    my $output_json_string = encode_json({
        success => 1,
        error => "$@"
    });
    write_file($output_file, $output_json_string) or die "Could not write to $output_file: $!";
    die "Error in function definition: $@";
}

# Call the arbitrary function with the Perl data structure
my $result = $arbitrary_function->(@$data);

# Encode the result into a JSON string
my $output_json_string = encode_json({
    success => 0,
    result => $result
});

# Write the JSON string to an output file
write_file($output_file, $output_json_string) or die "Could not write to $output_file: $!";
`
    }
}
