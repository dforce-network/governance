pragma solidity >=0.4.21 <0.7.0;


interface IERC20 {
    function balanceOf(address _owner) external view returns (uint256);
}


contract Voting {
    IERC20 public token;

    uint256 public startTime;
    uint256 public endTime;
    uint256 public optionCount;
    // The absulute threshold number with decimal for the vote result to be valid
    // Typical value could be 50000000000000000000000000 as 5% of df total supply
    uint256 public threshold;
    // The permillage of majority. If the votes for one option has reached majority portion, then it is finalized
    // Typical value could be 800
    uint16 public majority_permillage;

    bool public isFinalized;
    bool public isValid;

    mapping(address => uint256) public voteRecord;
    address[] public addressVoted;

    uint256[] public status;

    constructor(
        address _token,
        uint256 _start,
        uint256 _end,
        uint256 _optionCount,
        uint256 _threshold,
        uint16 _majority_permillage
    ) public {
        require(now < _end, "Please input a future end time");

        token = IERC20(_token);
        startTime = _start;
        endTime = _end;
        optionCount = _optionCount;
        status = new uint256[](_optionCount);
        threshold = _threshold;
        majority_permillage = _majority_permillage;

        isFinalized = false;
        isValid = false;
    }

    function getLiveStatus() private view returns (uint256[] memory) {
        uint256 length = addressVoted.length;
        uint256 i;

        uint256[] memory result = new uint256[](optionCount);

        for (i = 0; i < length; ++i) {
            address acc = addressVoted[i];
            uint256 option = voteRecord[acc] - 1;
            uint256 weight = token.balanceOf(acc);

            result[option] += weight;
        }

        return result;
    }

    function isAlive() public view returns (bool) {
        return (now > startTime) && (now < endTime) && !isFinalized;
    }

    // This would re-check the validation every time, even it is deemed valid before
    function checkForValidationAndFinalization() private {
        uint256 len = status.length;
        uint256 i;
        uint256 total = 0;

        for (i = 0; i < len; ++i) {
            total += status[i];
        }

        if (total >= threshold) {
            isValid = true;

            // Check finalization only when it is valid
            uint256 majority = (total / 1000) * majority_permillage;
            for (i = 0; i < len; ++i) {
                if (status[i] >= majority) {
                    isFinalized = true;
                    return;
                }
            }
        } else {
            isValid = false;
        }
    }

    function vote(uint256 _option) external {
        require(now > startTime, "Voting has not Started yet");
        require(now < endTime, "Voting has ended");
        require(!isFinalized, "Voting has been finalized");
        require(
            _option > 0 && _option <= optionCount,
            "Please choose a valid option"
        );
        //require(voteRecord[msg.sender] == 0, "You have voted already");
        require(token.balanceOf(msg.sender) != 0, "You have no toke available");

        if (voteRecord[msg.sender] == 0) {
            addressVoted.push(msg.sender);
        }

        voteRecord[msg.sender] = _option;

        status = getLiveStatus();

        checkForValidationAndFinalization();
    }

    function getTotalVote() external view returns (uint256[] memory) {
        require(now > startTime, "Voting has not Started yet");

        if (isAlive()) {
            return getLiveStatus();
        } else {
            return status;
        }
    }

    function getVoteRecord(address addr) external view returns (uint256) {
        return voteRecord[addr];
    }

    // !!! REMOVE BELOW FUNCTIONS WHEN DEPLOYING OFFICIAL CONTRACT
    function setEndTime(uint256 _end) external {
        endTime = _end;
    }

    function setStartTime(uint256 _start) external {
        startTime = _start;
    }
}
